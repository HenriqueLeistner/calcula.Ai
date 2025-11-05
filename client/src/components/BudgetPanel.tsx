import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { formatBRL } from '@/lib/currency';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Category, Budget } from '@/lib/db';

interface BudgetStatus {
  categoryId: string;
  categoryName: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
}

interface BudgetPanelProps {
  categories: Category[];
  budgets: Budget[];
  expensesByCategory: Record<string, number>;
  onSetBudget: (categoryId: string, limit: number) => void;
  onDeleteBudget: (categoryId: string) => void;
}

export default function BudgetPanel({
  categories,
  budgets,
  expensesByCategory,
  onSetBudget,
  onDeleteBudget,
}: BudgetPanelProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const budgetStatuses: BudgetStatus[] = budgets.map(budget => {
    const category = categories.find(c => c.id === budget.id);
    const spent = expensesByCategory[budget.id] || 0;
    const remaining = budget.limit - spent;
    const percentage = (spent / budget.limit) * 100;

    return {
      categoryId: budget.id,
      categoryName: category?.name || 'Desconhecida',
      limit: budget.limit,
      spent,
      remaining,
      percentage,
    };
  });

  const handleEdit = (categoryId: string, currentLimit: number) => {
    setEditingCategory(categoryId);
    setEditValue(currentLimit.toString());
  };

  const handleSave = (categoryId: string) => {
    const value = parseFloat(editValue);
    if (value > 0) {
      onSetBudget(categoryId, value);
    }
    setEditingCategory(null);
    setEditValue('');
  };

  const getStatusColor = (percentage: number) => {
    if (percentage < 80) return 'text-primary';
    if (percentage < 100) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-destructive';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage < 80) return <CheckCircle className="w-4 h-4" />;
    if (percentage < 100) return <AlertTriangle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Orçamentos</h3>
      </div>

      {budgetStatuses.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground">
          Nenhum orçamento configurado
        </Card>
      )}

      {budgetStatuses.map((status) => (
        <Card key={status.categoryId} className="p-4" data-testid={`budget-${status.categoryId}`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${getStatusColor(status.percentage)}`}>
                  {status.categoryName}
                </span>
                {getStatusIcon(status.percentage)}
              </div>
              <div className="flex items-center gap-2">
                {editingCategory === status.categoryId ? (
                  <>
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-24 h-8"
                      data-testid={`input-budget-${status.categoryId}`}
                    />
                    <Button size="sm" onClick={() => handleSave(status.categoryId)} data-testid={`button-save-${status.categoryId}`}>
                      Salvar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(status.categoryId, status.limit)}
                      data-testid={`button-edit-budget-${status.categoryId}`}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteBudget(status.categoryId)}
                      data-testid={`button-delete-budget-${status.categoryId}`}
                    >
                      Remover
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Progress value={Math.min(status.percentage, 100)} className="h-2" />

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Limite</div>
                <div className="font-medium">{formatBRL(status.limit)}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Gasto</div>
                <div className="font-medium">{formatBRL(status.spent)}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Restante</div>
                <div className={`font-medium ${status.remaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatBRL(status.remaining)}
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {status.percentage.toFixed(1)}% do orçamento utilizado
            </div>
          </div>
        </Card>
      ))}

      <Card className="p-4">
        <h4 className="font-medium mb-3">Adicionar Orçamento</h4>
        <div className="space-y-3">
          {expenseCategories.filter(cat => !budgets.find(b => b.id === cat.id)).map(category => (
            <div key={category.id} className="flex items-center justify-between">
              <span className="text-sm">{category.name}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingCategory(category.id);
                  setEditValue('1000');
                }}
                data-testid={`button-add-budget-${category.id}`}
              >
                Adicionar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
