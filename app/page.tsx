import WorldClock from "./components/WorldClock";
import MarketStatus from "./components/MarketStatus";

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-12 md:px-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light mb-3 text-black tracking-tight">
            世界股市时钟
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-light">
            查看世界各地股市开盘时间和当前状态
          </p>
        </header>
        
        <main className="flex flex-col gap-12">
          <section>
            <h2 className="text-xl md:text-2xl font-light mb-6 text-black border-b border-gray-200 pb-3">
              世界时钟
            </h2>
            <WorldClock />
          </section>
          
          <section>
            <h2 className="text-xl md:text-2xl font-light mb-6 text-black border-b border-gray-200 pb-3">
              股市状态
            </h2>
            <MarketStatus />
          </section>
        </main>
        
        <footer className="mt-20 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center font-light">
            © {new Date().getFullYear()} 世界股市时钟
          </p>
        </footer>
      </div>
    </div>
  );
}
