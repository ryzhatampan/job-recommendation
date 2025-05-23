
import { Briefcase, BarChartBig, Home } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-foreground hover:text-primary transition-colors">
          <Briefcase className="h-7 w-7 text-primary" />
          FutureGen Career Guide
        </Link>
        <nav>
          <ul className="flex items-center gap-4 md:gap-6">
            <li>
              <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <Home className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Beranda</span>
              </Link>
            </li>
            <li>
              <Link href="/jobs" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <Briefcase className="h-4 w-4 md:h-5 md:w-5" />
                 <span className="hidden sm:inline">Lowongan</span>
              </Link>
            </li>
            <li>
              <Link href="/qea-calculator" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <BarChartBig className="h-4 w-4 md:h-5 md:w-5" />
                 <span className="hidden sm:inline">Kalkulator QEA</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
