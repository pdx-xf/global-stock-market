"use client";

import { useState, useEffect } from "react";
import { StockMarket } from "../data/markets";

interface MarketCountdownProps {
  market: StockMarket;
  status: "open" | "closed";
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

        // 解析开盘和收盘时间
        const [openHour, openMinute] = market.openingTime
          .split(":")
          .map(Number);
        const [closeHour, closeMinute] = market.closingTime
          .split(":")
          .map(Number);

        let targetHour: number;
        let targetMinute: number;

        if (status === "open") {
          // 如果市场开盘，倒计时到收盘
          targetHour = closeHour;
          targetMinute = closeMinute;
        } else {
          // 如果市场收盘，倒计时到开盘
          // 检查是否是今天开盘还是明天开盘
          const dayOfWeek = marketDate.getDay();
          const isTradingDay = market.weekdays.includes(dayOfWeek);

          if (isTradingDay && currentHour < openHour) {
            // 今天是交易日，但还没到开盘时间
            targetHour = openHour;
            targetMinute = openMinute;
          } else {
            // 找到下一个交易日
            let daysToAdd = 1;
            let nextTradingDay = (dayOfWeek + daysToAdd) % 7;

            while (!market.weekdays.includes(nextTradingDay)) {
              daysToAdd++;
              nextTradingDay = (dayOfWeek + daysToAdd) % 7;
            }

            targetHour = openHour;
            targetMinute = openMinute;

            // 如果是下一个交易日，直接返回天数
            if (daysToAdd > 0) {
              setCountdown(`${daysToAdd}天后开盘`);
              return;
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
          remainingSeconds += 24 * 3600; // 加上24小时
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

  return (
    <div className="mt-2 p-1 rounded bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
      <p className="text-xs text-gray-700 dark:text-gray-300">
        {status === "open" ? "距离收盘还有:" : "距离开盘还有:"}
        <span className="font-mono font-medium ml-1 text-gray-800 dark:text-gray-100">{countdown}</span>
      </p>
    </div>
  );
}
