export interface StockMarket {
  name: string;
  country: string;
  timezone: string;
  openingTime: string; // 格式: "HH:MM"
  closingTime: string; // 格式: "HH:MM"
  weekdays: number[]; // 0-6, 0代表周日
  description?: string;
  // 盘前盘后交易时间（可选，主要用于美股）
  preMarketTime?: string; // 盘前开始时间
  afterMarketTime?: string; // 盘后结束时间
}

export const stockMarkets: StockMarket[] = [
  {
    name: "纽约证券交易所 (NYSE)",
    country: "美国",
    timezone: "America/New_York",
    openingTime: "09:30",
    closingTime: "16:00",
    preMarketTime: "04:00",
    afterMarketTime: "20:00",
    weekdays: [1, 2, 3, 4, 5],
    description: "世界最大的证券交易所"
  },
  {
    name: "纳斯达克 (NASDAQ)",
    country: "美国",
    timezone: "America/New_York",
    openingTime: "09:30",
    closingTime: "16:00",
    preMarketTime: "04:00",
    afterMarketTime: "20:00",
    weekdays: [1, 2, 3, 4, 5],
    description: "世界第二大证券交易所"
  },
  {
    name: "上海证券交易所 (SSE)",
    country: "中国",
    timezone: "Asia/Shanghai",
    openingTime: "09:30",
    closingTime: "15:00",
    weekdays: [1, 2, 3, 4, 5],
    description: "中国大陆最大的证券交易所"
  },
  {
    name: "深圳证券交易所 (SZSE)",
    country: "中国",
    timezone: "Asia/Shanghai",
    openingTime: "09:30",
    closingTime: "15:00",
    weekdays: [1, 2, 3, 4, 5],
    description: "中国大陆第二大证券交易所"
  },
  {
    name: "东京证券交易所 (TSE)",
    country: "日本",
    timezone: "Asia/Tokyo",
    openingTime: "09:00",
    closingTime: "15:00",
    weekdays: [1, 2, 3, 4, 5],
    description: "亚洲最大的证券交易所"
  },
  {
    name: "伦敦证券交易所 (LSE)",
    country: "英国",
    timezone: "Europe/London",
    openingTime: "08:00",
    closingTime: "16:30",
    weekdays: [1, 2, 3, 4, 5],
    description: "欧洲最大的证券交易所"
  },
  {
    name: "香港交易所 (HKEX)",
    country: "中国香港",
    timezone: "Asia/Hong_Kong",
    openingTime: "09:30",
    closingTime: "16:00",
    weekdays: [1, 2, 3, 4, 5],
    description: "亚洲重要的国际金融中心"
  },
  {
    name: "法兰克福证券交易所 (FWB)",
    country: "德国",
    timezone: "Europe/Berlin",
    openingTime: "09:00",
    closingTime: "17:30",
    weekdays: [1, 2, 3, 4, 5],
    description: "德国最大的证券交易所"
  },
  {
    name: "多伦多证券交易所 (TSX)",
    country: "加拿大",
    timezone: "America/Toronto",
    openingTime: "09:30",
    closingTime: "16:00",
    weekdays: [1, 2, 3, 4, 5],
    description: "加拿大最大的证券交易所"
  },
  {
    name: "澳大利亚证券交易所 (ASX)",
    country: "澳大利亚",
    timezone: "Australia/Sydney",
    openingTime: "10:00",
    closingTime: "16:00",
    weekdays: [1, 2, 3, 4, 5],
    description: "澳大利亚最大的证券交易所"
  }
];

export const majorTimezones = [
  { name: "纽约", timezone: "America/New_York" },
  { name: "伦敦", timezone: "Europe/London" },
  { name: "东京", timezone: "Asia/Tokyo" },
  { name: "上海", timezone: "Asia/Shanghai" },
  { name: "香港", timezone: "Asia/Hong_Kong" },
  { name: "悉尼", timezone: "Australia/Sydney" },
  { name: "法兰克福", timezone: "Europe/Berlin" },
  { name: "多伦多", timezone: "America/Toronto" }
];