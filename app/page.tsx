import WorldClock from "./components/WorldClock";
import MarketStatus from "./components/MarketStatus";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-12 md:px-12 md:py-16" style={{ backgroundColor: 'var(--background)' }}>
      <ThemeToggle />
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light mb-3 tracking-tight" style={{ color: 'var(--foreground)' }}>
            世界股市时钟
          </h1>
          <p className="text-sm md:text-base font-light" style={{ color: 'var(--secondary)' }}>
            查看世界各地股市开盘时间和当前状态
          </p>
        </header>
        
        <main className="flex flex-col gap-12">
          <section>
            <h2 className="text-xl md:text-2xl font-light mb-6 pb-3 border-b" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>
              世界时钟
            </h2>
            <WorldClock />
          </section>
          
          <section>
            <h2 className="text-xl md:text-2xl font-light mb-6 pb-3 border-b" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>
              股市状态
            </h2>
            <MarketStatus />
          </section>
        </main>
        
        <footer className="mt-20 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs text-center font-light" style={{ color: 'var(--muted)' }}>
            © {new Date().getFullYear()} 世界股市时钟
          </p>
        </footer>
      </div>
    </div>
  );
}
