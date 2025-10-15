"use client";

import { useState, useEffect } from "react";
import { StockMarket } from "../data/markets";

type MarketStatusType = "pre-market" | "open" | "after-hours" | "closed";

interface MarketCountdownProps {
  market: StockMarket;
  status: MarketStatusType;
}

export default function MarketCountdown({
  market,
  status,
}: MarketCountdownProps) {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const calculateCountdown = () => {
      try {
        const now = new Date();
        const marketDate = new Date(
          now.toLocaleString("en-US", { timeZone: market.timezone })
        );
        const currentHour = marketDate.getHours();
        const currentMinute = marketDate.getMinutes();
        const currentSecond = marketDate.getSeconds();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        // 解析各个时间段
        const [openHour, openMinute] = market.openingTime
          .split(":")
          .map(Number);
        const [closeHour, closeMinute] = market.closingTime
          .split(":")
          .map(Number);

        let targetHour: number;
        let targetMinute: number;

        // 根据不同状态设置目标时间
        if (status === "pre-market") {
          // 盘前交易中，倒计时到正常交易开盘
          targetHour = openHour;
          targetMinute = openMinute;
        } else if (status === "open") {
          // 正常交易中，倒计时到收盘
          targetHour = closeHour;
          targetMinute = closeMinute;
        } else if (status === "after-hours") {
          // 盘后交易中，倒计时到盘后结束
          if (market.afterMarketTime) {
            const [afterHour, afterMinute] = market.afterMarketTime
              .split(":")
              .map(Number);
            targetHour = afterHour;
            targetMinute = afterMinute;
          } else {
            targetHour = closeHour;
            targetMinute = closeMinute;
          }
        } else {
          // 已收盘，倒计时到下一个交易时段
          const dayOfWeek = marketDate.getDay();
          const isTradingDay = market.weekdays.includes(dayOfWeek);

          // 判断下一个时段的开始时间
          if (market.preMarketTime) {
            const [preHour, preMinute] = market.preMarketTime
              .split(":")
              .map(Number);
            const preTimeInMinutes = preHour * 60 + preMinute;

            if (isTradingDay && currentTimeInMinutes < preTimeInMinutes) {
              // 今天还没到盘前交易时间
              targetHour = preHour;
              targetMinute = preMinute;
            } else {
              // 找到下一个交易日的盘前交易时间
              let daysToAdd = 1;
              let nextTradingDay = (dayOfWeek + daysToAdd) % 7;

              while (!market.weekdays.includes(nextTradingDay)) {
                daysToAdd++;
                nextTradingDay = (dayOfWeek + daysToAdd) % 7;
              }

              targetHour = preHour;
              targetMinute = preMinute;

              if (daysToAdd > 0) {
                setCountdown(`${daysToAdd}天后开盘`);
                return;
              }
            }
          } else {
            // 没有盘前交易，倒计时到正常交易时间
            if (
              isTradingDay &&
              currentTimeInMinutes < openHour * 60 + openMinute
            ) {
              targetHour = openHour;
              targetMinute = openMinute;
            } else {
              let daysToAdd = 1;
              let nextTradingDay = (dayOfWeek + daysToAdd) % 7;

              while (!market.weekdays.includes(nextTradingDay)) {
                daysToAdd++;
                nextTradingDay = (dayOfWeek + daysToAdd) % 7;
              }

              targetHour = openHour;
              targetMinute = openMinute;

              if (daysToAdd > 0) {
                setCountdown(`${daysToAdd}天后开盘`);
                return;
              }
            }
          }
        }

        // 计算目标时间的总秒数
        const targetTotalSeconds = targetHour * 3600 + targetMinute * 60;
        const currentTotalSeconds =
          currentHour * 3600 + currentMinute * 60 + currentSecond;

        // 计算剩余秒数
        let remainingSeconds = targetTotalSeconds - currentTotalSeconds;
        if (remainingSeconds < 0 && status === "closed") {
          // 如果是收盘状态且剩余时间为负，说明是明天开盘
          remainingSeconds += 24 * 3600;
        }

        // 转换为时分秒格式
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        setCountdown(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } catch (error) {
        console.error("Error calculating countdown:", error);
        setCountdown("--:--:--");
      }
    };

    // 立即计算一次
    calculateCountdown();

    // 每秒更新一次
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [market, status]);

  // 根据状态返回倒计时文本
  const getCountdownLabel = () => {
    switch (status) {
      case "pre-market":
        return "距离正常交易还有:";
      case "open":
        return "距离收盘还有:";
      case "after-hours":
        return "距离盘后结束还有:";
      case "closed":
      default:
        return "距离开盘还有:";
    }
  };

  return (
    <div className="mt-2 p-2 rounded-md bg-gray-50 border border-gray-200">
      <p className="text-xs text-gray-700">
        {getCountdownLabel()}
        <span className="font-mono font-bold ml-1 text-gray-800">
          {countdown}
        </span>
      </p>
    </div>
  );
}
