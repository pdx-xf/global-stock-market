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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            搜索股市
          </label>
          <input
            type="text"
            id="search"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-gray-900"
            placeholder="输入股市名称..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            国家/地区
          </label>
          <select
            id="country"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-gray-900"
            value={country}
            onChange={handleCountryChange}
          >
            <option value="">所有国家/地区</option>
            {countries.filter(c => c !== '').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            交易状态
          </label>
          <select
            id="status"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-gray-900"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="all">所有状态</option>
            <option value="open">交易中</option>
            <option value="closed">已收盘</option>
          </select>
        </div>
      </div>
    </div>
  );
}