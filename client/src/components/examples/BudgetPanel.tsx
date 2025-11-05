import BudgetPanel from '../BudgetPanel';

export default function BudgetPanelExample() {
  const mockCategories = [
    { id: 'cat-1', name: 'Casa', type: 'expense' as const },
    { id: 'cat-2', name: 'Mercado', type: 'expense' as const },
    { id: 'cat-3', name: 'Transporte', type: 'expense' as const },
  ];

  const mockBudgets = [
    { id: 'cat-1', limit: 1500 },
    { id: 'cat-2', limit: 800 },
  ];

  const mockExpenses = {
    'cat-1': 1200,
    'cat-2': 750,
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <BudgetPanel
        categories={mockCategories}
        budgets={mockBudgets}
        expensesByCategory={mockExpenses}
        onSetBudget={(id, limit) => console.log('Set budget:', id, limit)}
        onDeleteBudget={(id) => console.log('Delete budget:', id)}
      />
    </div>
  );
}
