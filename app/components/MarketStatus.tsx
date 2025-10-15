"use client";

import { useState, useEffect } from "react";
import { stockMarkets, StockMarket } from "../data/markets";
import MarketCountdown from "./MarketCountdown";
import MarketFilter from "./MarketFilter";

interface MarketStatusProps {
  market: StockMarket;
}

type MarketStatusType = "pre-market" | "open" | "after-hours" | "closed";

function MarketStatusItem({ market }: MarketStatusProps) {
  const [status, setStatus] = useState<MarketStatusType>("closed");
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const checkStatus = () => {
      try {
        // 获取市场所在时区的当前时间
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: market.timezone,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };

        const formatter = new Intl.DateTimeFormat("zh-CN", options);
        const formattedDate = formatter.format(now);
        setLocalTime(formattedDate);

        // 获取当前是星期几 (0-6, 0代表周日)
        const marketDate = new Date(
          now.toLocaleString("en-US", { timeZone: market.timezone })
        );
        const dayOfWeek = marketDate.getDay();

        // 检查今天是否是交易日
        if (!market.weekdays.includes(dayOfWeek)) {
          setStatus("closed");
          return;
        }

        // 获取当前小时和分钟
        const currentHour = marketDate.getHours();
        const currentMinute = marketDate.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        // 解析正常交易时间
        const [openHour, openMinute] = market.openingTime
          .split(":")
          .map(Number);
        const [closeHour, closeMinute] = market.closingTime
          .split(":")
          .map(Number);
        const openTimeInMinutes = openHour * 60 + openMinute;
        const closeTimeInMinutes = closeHour * 60 + closeMinute;

        // 检查是否有盘前盘后交易时间（主要用于美股）
        if (market.preMarketTime && market.afterMarketTime) {
          const [preHour, preMinute] = market.preMarketTime
            .split(":")
            .map(Number);
          const [afterHour, afterMinute] = market.afterMarketTime
            .split(":")
            .map(Number);
          const preTimeInMinutes = preHour * 60 + preMinute;
          const afterTimeInMinutes = afterHour * 60 + afterMinute;

          // 判断当前处于哪个交易时段
          if (
            currentTimeInMinutes >= preTimeInMinutes &&
            currentTimeInMinutes < openTimeInMinutes
          ) {
            setStatus("pre-market");
          } else if (
            currentTimeInMinutes >= openTimeInMinutes &&
            currentTimeInMinutes < closeTimeInMinutes
          ) {
            setStatus("open");
          } else if (
            currentTimeInMinutes >= closeTimeInMinutes &&
            currentTimeInMinutes < afterTimeInMinutes
          ) {
            setStatus("after-hours");
          } else {
            setStatus("closed");
          }
        } else {
          // 没有盘前盘后交易时间，只判断正常交易时间
          if (
            currentTimeInMinutes >= openTimeInMinutes &&
            currentTimeInMinutes < closeTimeInMinutes
          ) {
            setStatus("open");
          } else {
            setStatus("closed");
          }
        }
      } catch (error) {
        console.error("Error checking market status:", error);
        setStatus("closed");
      }
    };

    // 立即检查一次
    checkStatus();

    // 每秒检查一次，而不是每分钟
    const interval = setInterval(checkStatus, 1000);

    return () => clearInterval(interval);
  }, [market]);

  // 根据状态返回对应的样式和文本
  const getStatusConfig = () => {
    switch (status) {
      case "pre-market":
        return {
          className: "bg-black text-white text-xs px-2 py-1",
          text: "盘前交易",
        };
      case "open":
        return {
          className: "bg-black text-white text-xs px-2 py-1",
          text: "交易中",
        };
      case "after-hours":
        return {
          className: "bg-black text-white text-xs px-2 py-1",
          text: "盘后交易",
        };
      case "closed":
      default:
        return {
          className: "bg-white text-black border border-gray-300 text-xs px-2 py-1",
          text: "已收盘",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="bg-white p-5 border border-gray-200 hover:border-black transition-colors">
      <div className="flex justify-between items-start mb-3 gap-2">
        <h3 className="text-base font-light text-black">
          {market.name}
        </h3>
        <span className={`whitespace-nowrap font-light ${statusConfig.className}`}>
          {statusConfig.text}
        </span>
      </div>
      
      <p className="text-xs text-gray-500 mb-3 font-light">
        {market.country}
      </p>

      {/* 显示交易时间 */}
      {market.preMarketTime && market.afterMarketTime ? (
        <div className="text-xs text-gray-600 mb-3 space-y-1 font-light">
          <p>盘前交易: {market.preMarketTime} - {market.openingTime}</p>
          <p>正常交易: {market.openingTime} - {market.closingTime}</p>
          <p>盘后交易: {market.closingTime} - {market.afterMarketTime}</p>
        </div>
      ) : (
        <p className="text-xs text-gray-600 mb-3 font-light">
          交易时间: {market.openingTime} - {market.closingTime}
        </p>
      )}

      <p className="text-xs text-gray-600 font-light mb-2">
        当地时间: {localTime}
      </p>

      {/* 添加倒计时组件 */}
      <MarketCountdown market={market} status={status} />

      {market.description && (
        <p className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 font-light">
          {market.description}
        </p>
      )}
    </div>
  );
}

export default function MarketStatus() {
  const [filteredMarkets, setFilteredMarkets] = useState(stockMarkets);

  const handleFilterChange = (filters: {
    searchTerm: string;
    country: string;
    status: "all" | "open" | "closed";
  }) => {
    // 根据过滤条件筛选股市
    const filtered = stockMarkets.filter((market) => {
      // 搜索词过滤
      if (
        filters.searchTerm &&
        !market.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !market.country.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      // 国家过滤
      if (filters.country && market.country !== filters.country) {
        return false;
      }

      // 状态过滤 (这里需要实时计算状态，简化处理)
      if (filters.status !== "all") {
        // 这里简化处理，实际应用中可能需要更复杂的逻辑
        const now = new Date();
        const marketDate = new Date(
          now.toLocaleString("en-US", { timeZone: market.timezone })
        );
        const dayOfWeek = marketDate.getDay();

        // 检查今天是否是交易日
        if (!market.weekdays.includes(dayOfWeek)) {
          return filters.status === "closed";
        }

        const currentHour = marketDate.getHours();
        const currentMinute = marketDate.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        const [openHour, openMinute] = market.openingTime
          .split(":")
          .map(Number);
        const [closeHour, closeMinute] = market.closingTime
          .split(":")
          .map(Number);
        const openTimeInMinutes = openHour * 60 + openMinute;
        const closeTimeInMinutes = closeHour * 60 + closeMinute;

        // 判断市场状态（支持盘前盘后）
        let currentStatus: "open" | "closed" = "closed";

        if (market.preMarketTime && market.afterMarketTime) {
          const [preHour, preMinute] = market.preMarketTime
            .split(":")
            .map(Number);
          const [afterHour, afterMinute] = market.afterMarketTime
            .split(":")
            .map(Number);
          const preTimeInMinutes = preHour * 60 + preMinute;
          const afterTimeInMinutes = afterHour * 60 + afterMinute;

          // 只要在盘前到盘后之间，都算是"交易中"状态
          if (
            currentTimeInMinutes >= preTimeInMinutes &&
            currentTimeInMinutes < afterTimeInMinutes
          ) {
            currentStatus = "open";
          }
        } else {
          // 没有盘前盘后，只判断正常交易时间
          if (
            currentTimeInMinutes >= openTimeInMinutes &&
            currentTimeInMinutes < closeTimeInMinutes
          ) {
            currentStatus = "open";
          }
        }

        if (
          (filters.status === "open" && currentStatus !== "open") ||
          (filters.status === "closed" && currentStatus !== "closed")
        ) {
          return false;
        }
      }

      return true;
    });

    setFilteredMarkets(filtered);
  };

  return (
    <div className="w-full">
      <MarketFilter onFilterChange={handleFilterChange} />

      {filteredMarkets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm font-light">
            没有找到匹配的股市
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {filteredMarkets.map((market) => (
            <MarketStatusItem key={market.name} market={market} />
          ))}
        </div>
      )}
    </div>
  );
}
