import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { formatBRL } from '@/lib/currency';

interface BalanceData {
  date: string;
  balance: number;
}

interface BalanceLineProps {
  data: BalanceData[];
}

export default function BalanceLine({ data }: BalanceLineProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Saldo Acumulado</h3>
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          Sem dados para exibir
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Saldo Acumulado no Mês</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => formatBRL(value)} />
          <Tooltip formatter={(value: number) => formatBRL(value)} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#059669" 
            strokeWidth={2}
            name="Saldo"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
