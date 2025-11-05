import TransactionForm from '../TransactionForm';

export default function TransactionFormExample() {
  const mockCategories = [
    { id: '1', name: 'Salário', type: 'income' as const },
    { id: '2', name: 'Freelance', type: 'income' as const },
    { id: '3', name: 'Casa', type: 'expense' as const },
    { id: '4', name: 'Mercado', type: 'expense' as const },
  ];

  return (
    <div className="max-w-md mx-auto p-4">
      <TransactionForm
        categories={mockCategories}
        onSubmit={(data) => console.log('Transaction submitted:', data)}
      />
    </div>
  );
}
