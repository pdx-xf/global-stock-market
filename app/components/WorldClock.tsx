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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {majorTimezones.map(({ name }) => (
        <div 
          key={name} 
          className="p-5 border transition-colors"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--hover-border)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <h3 className="text-xs mb-2 font-light uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
            {name}
          </h3>
          <p className="text-2xl font-mono font-light tabular-nums" style={{ color: 'var(--foreground)' }}>
            {times[name] || '--:--:--'}
          </p>
        </div>
      ))}
    </div>
  );
}