
import { Briefcase, BarChartBig } from 'lucide-react';
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
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Daftar Pekerjaan
              </Link>
            </li>
            <li>
              <Link href="/qea-calculator" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <BarChartBig className="h-5 w-5" />
                Kalkulator QEA
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
