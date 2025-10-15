import WorldClock from "./components/WorldClock";
import MarketStatus from "./components/MarketStatus";

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-white">
      <header className="mb-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-gray-900">世界股市时钟</h1>
        <p className="text-gray-600 text-center">查看世界各地股市开盘时间和当前状态</p>
      </header>
      
      <main className="max-w-7xl mx-auto flex flex-col gap-8 text-gray-700">
        <section className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">世界时钟</h2>
          <WorldClock />
        </section>
        
        <section className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">股市状态</h2>
          <MarketStatus />
        </section>
      </main>
      
      <footer className="mt-12 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} 世界股市时钟 | 基于 Next.js 开发</p>
      </footer>
    </div>
  );
}
