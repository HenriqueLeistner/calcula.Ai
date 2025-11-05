import { Button } from '@/components/ui/button';
import { formatBRL } from '@/lib/currency';
import { formatDate } from '@/lib/date';
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import type { Transaction, Category } from '@/lib/db';

interface TransactionsTableProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export default function TransactionsTable({ 
  transactions, 
  categories,
  onEdit, 
  onDelete 
}: TransactionsTableProps) {
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma transação encontrada
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="border rounded-md p-4 hover-elevate flex items-center justify-between gap-4"
          data-testid={`transaction-${transaction.id}`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-md ${transaction.type === 'income' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
              {transaction.type === 'income' ? (
                <TrendingUp className={`w-4 h-4 text-primary`} />
              ) : (
                <TrendingDown className={`w-4 h-4 text-destructive`} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{transaction.description}</div>
              <div className="text-sm text-muted-foreground">
                {getCategoryName(transaction.category)} • {formatDate(transaction.date)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`font-mono font-semibold text-lg ${transaction.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
              {transaction.type === 'income' ? '+' : '-'} {formatBRL(transaction.amount)}
            </div>
            
            {onEdit && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(transaction)}
                data-testid={`button-edit-${transaction.id}`}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(transaction.id)}
                data-testid={`button-delete-${transaction.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
