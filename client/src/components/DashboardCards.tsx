import { Card } from '@/components/ui/card';
import { formatBRL } from '@/lib/currency';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface DashboardCardsProps {
  income: number;
  expense: number;
  balance: number;
}

export default function DashboardCards({ income, expense, balance }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Receitas
          </span>
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div className="text-3xl font-bold tabular-nums font-mono text-primary">
          {formatBRL(income)}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Despesas
          </span>
          <TrendingDown className="w-4 h-4 text-destructive" />
        </div>
        <div className="text-3xl font-bold tabular-nums font-mono text-destructive">
          {formatBRL(expense)}
        </div>
      </Card>

      <Card className="p-6 md:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Saldo
          </span>
          <Wallet className="w-4 h-4 text-foreground" />
        </div>
        <div className={`text-3xl font-bold tabular-nums font-mono ${balance >= 0 ? 'text-primary' : 'text-destructive'}`}>
          {formatBRL(balance)}
        </div>
      </Card>
    </div>
  );
}
