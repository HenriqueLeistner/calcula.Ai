import TransactionsTable from '../TransactionsTable';

export default function TransactionsTableExample() {
  const mockTransactions = [
    { id: '1', type: 'income' as const, date: '2025-11-01', category: 'cat-1', description: 'Salário', amount: 5000 },
    { id: '2', type: 'expense' as const, date: '2025-11-05', category: 'cat-2', description: 'Supermercado', amount: 250.50 },
    { id: '3', type: 'expense' as const, date: '2025-11-10', category: 'cat-3', description: 'Energia', amount: 180 },
  ];

  const mockCategories = [
    { id: 'cat-1', name: 'Salário', type: 'income' as const },
    { id: 'cat-2', name: 'Mercado', type: 'expense' as const },
    { id: 'cat-3', name: 'Casa', type: 'expense' as const },
  ];

  return (
    <div className="p-4">
      <TransactionsTable
        transactions={mockTransactions}
        categories={mockCategories}
        onEdit={(t) => console.log('Edit:', t)}
        onDelete={(id) => console.log('Delete:', id)}
      />
    </div>
  );
}
