'use client';

import { useState, useEffect } from 'react';
import { majorTimezones } from '../data/markets';

export default function WorldClock() {
  const [times, setTimes] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    const updateTimes = () => {
      const newTimes: {[key: string]: string} = {};
      
      majorTimezones.forEach(({ name, timezone }) => {
        const options: Intl.DateTimeFormatOptions = {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: timezone
        };
        
        newTimes[name] = new Intl.DateTimeFormat('zh-CN', options).format(new Date());
      });
      
      setTimes(newTimes);
    };
    
    // 立即更新一次
    updateTimes();
    
    // 每秒更新一次
    const interval = setInterval(updateTimes, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {majorTimezones.map(({ name }) => (
        <div key={name} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg border border-gray-200 transition-all hover:scale-105">
          <h3 className="text-lg font-semibold mb-1 text-gray-700">{name}</h3>
          <p className="text-2xl font-mono text-gray-800 font-bold">{times[name] || '--:--:--'}</p>
        </div>
      ))}
    </div>
  );
}