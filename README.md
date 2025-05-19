# 世界股市时钟应用

这是一个基于Next.js开发的世界各地股市开盘时间和世界时间查看应用。用户可以实时查看世界各地主要股市的开盘状态和当地时间。

## 功能特点

- 实时显示世界各地主要城市的当前时间
- 显示主要股票市场的开盘和收盘时间
- 根据当前时间自动计算各股市的开盘/收盘状态
- 响应式设计，适配各种设备屏幕
- 支持深色模式

## 包含的股市

- 纽约证券交易所 (NYSE)
- 纳斯达克 (NASDAQ)
- 上海证券交易所 (SSE)
- 深圳证券交易所 (SZSE)
- 东京证券交易所 (TSE)
- 伦敦证券交易所 (LSE)
- 香港交易所 (HKEX)
- 法兰克福证券交易所 (FWB)
- 多伦多证券交易所 (TSX)
- 澳大利亚证券交易所 (ASX)

## 技术栈

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Intl API (用于时区和时间格式化)

## 开始使用

首先，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 部署

最简单的部署方式是使用 [Vercel Platform](https://vercel.com/new)，这是 Next.js 的创建者提供的平台。

查看 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。
