'use client';

import { useState } from 'react';
import { stockMarkets } from '../data/markets';

interface MarketFilterProps {
  onFilterChange: (filters: {
    searchTerm: string;
    country: string;
    status: 'all' | 'open' | 'closed';
  }) => void;
}

export default function MarketFilter({ onFilterChange }: MarketFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState<'all' | 'open' | 'closed'>('all');

  // 获取所有唯一的国家列表
  const countries = ['', ...new Set(stockMarkets.map(market => market.country))];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onFilterChange({ searchTerm: newSearchTerm, country, status });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    onFilterChange({ searchTerm, country: newCountry, status });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'all' | 'open' | 'closed';
    setStatus(newStatus);
    onFilterChange({ searchTerm, country, status: newStatus });
  };

  return (
    <div className="p-6 border mb-8" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-xs mb-2 font-light uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
            搜索
          </label>
          <input
            type="text"
            id="search"
            className="w-full px-3 py-2 border focus:outline-none text-sm font-light transition-colors"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--foreground)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--hover-border)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--input-border)';
            }}
            placeholder="股市名称..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div>
          <label htmlFor="country" className="block text-xs mb-2 font-light uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
            国家/地区
          </label>
          <select
            id="country"
            className="w-full px-3 py-2 border focus:outline-none text-sm font-light cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--foreground)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--hover-border)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--input-border)';
            }}
            value={country}
            onChange={handleCountryChange}
          >
            <option value="">全部</option>
            {countries.filter(c => c !== '').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-xs mb-2 font-light uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
            状态
          </label>
          <select
            id="status"
            className="w-full px-3 py-2 border focus:outline-none text-sm font-light cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--foreground)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--hover-border)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--input-border)';
            }}
            value={status}
            onChange={handleStatusChange}
          >
            <option value="all">全部</option>
            <option value="open">交易中</option>
            <option value="closed">已收盘</option>
          </select>
        </div>
      </div>
    </div>
  );
}