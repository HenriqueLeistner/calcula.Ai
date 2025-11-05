import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import { formatBRL } from '@/lib/currency';

interface ExpenseData {
  name: string;
  value: number;
}

interface ExpensesPieProps {
  data: ExpenseData[];
}

const COLORS = ['#059669', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

export default function ExpensesPie({ data }: ExpensesPieProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          Sem dados para exibir
        </div>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatBRL(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <div className="text-sm text-muted-foreground">Total de Despesas</div>
        <div className="text-2xl font-bold font-mono">{formatBRL(total)}</div>
      </div>
    </Card>
  );
}
