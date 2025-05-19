'use client';

import { useState, useEffect } from 'react';
import { stockMarkets, StockMarket } from '../data/markets';
import MarketCountdown from './MarketCountdown';
import MarketFilter from './MarketFilter';

interface MarketStatusProps {
  market: StockMarket;
}

function MarketStatusItem({ market }: MarketStatusProps) {
  const [status, setStatus] = useState<'open' | 'closed'>('closed');
  const [localTime, setLocalTime] = useState('');
  
  useEffect(() => {
    const checkStatus = () => {
      try {
        // 获取市场所在时区的当前时间
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: market.timezone,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
        
        const formatter = new Intl.DateTimeFormat('zh-CN', options);
        const formattedDate = formatter.format(now);
        setLocalTime(formattedDate);
        
        // 获取当前是星期几 (0-6, 0代表周日)
        const marketDate = new Date(now.toLocaleString('en-US', { timeZone: market.timezone }));
        const dayOfWeek = marketDate.getDay();
        
        // 检查今天是否是交易日
        if (!market.weekdays.includes(dayOfWeek)) {
          setStatus('closed');
          return;
        }
        
        // 解析开盘和收盘时间
        const [openHour, openMinute] = market.openingTime.split(':').map(Number);
        const [closeHour, closeMinute] = market.closingTime.split(':').map(Number);
        
        // 获取当前小时和分钟
        const currentHour = marketDate.getHours();
        const currentMinute = marketDate.getMinutes();
        
        // 转换为分钟数进行比较
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        const openTimeInMinutes = openHour * 60 + openMinute;
        const closeTimeInMinutes = closeHour * 60 + closeMinute;
        
        // 判断市场是否开盘
        if (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes) {
          setStatus('open');
        } else {
          setStatus('closed');
        }
      } catch (error) {
        console.error('Error checking market status:', error);
        setStatus('closed');
      }
    };
    
    // 立即检查一次
    checkStatus();
    
    // 每秒检查一次，而不是每分钟
    const interval = setInterval(checkStatus, 1000);
    
    return () => clearInterval(interval);
  }, [market]);
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{market.name}</h3>
        <span className={`inline-block px-2 py-1 text-xs rounded-full whitespace-nowrap ${status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {status === 'open' ? '交易中' : '已收盘'}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{market.country}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">交易时间: {market.openingTime} - {market.closingTime}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">当地时间: {localTime}</p>
      
      {/* 添加倒计时组件 */}
      <MarketCountdown market={market} status={status} />
      
      {market.description && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">{market.description}</p>
      )}
    </div>
  );
}

export default function MarketStatus() {
  const [filteredMarkets, setFilteredMarkets] = useState(stockMarkets);
  
  const handleFilterChange = (filters: {
    searchTerm: string;
    country: string;
    status: 'all' | 'open' | 'closed';
  }) => {
    // 根据过滤条件筛选股市
    const filtered = stockMarkets.filter(market => {
      // 搜索词过滤
      if (filters.searchTerm && !market.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
          !market.country.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      // 国家过滤
      if (filters.country && market.country !== filters.country) {
        return false;
      }
      
      // 状态过滤 (这里需要实时计算状态，简化处理)
      if (filters.status !== 'all') {
        // 这里简化处理，实际应用中可能需要更复杂的逻辑
        const now = new Date();
        const marketDate = new Date(now.toLocaleString('en-US', { timeZone: market.timezone }));
        const dayOfWeek = marketDate.getDay();
        
        // 检查今天是否是交易日
        if (!market.weekdays.includes(dayOfWeek)) {
          return filters.status === 'closed';
        }
        
        const [openHour, openMinute] = market.openingTime.split(':').map(Number);
        const [closeHour, closeMinute] = market.closingTime.split(':').map(Number);
        
        const currentHour = marketDate.getHours();
        const currentMinute = marketDate.getMinutes();
        
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        const openTimeInMinutes = openHour * 60 + openMinute;
        const closeTimeInMinutes = closeHour * 60 + closeMinute;
        
        const isOpen = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes;
        
        if ((filters.status === 'open' && !isOpen) || (filters.status === 'closed' && isOpen)) {
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
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">没有找到匹配的股市</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {filteredMarkets.map((market) => (
            <MarketStatusItem key={market.name} market={market} />
          ))}
        </div>
      )}
    </div>
  );
}