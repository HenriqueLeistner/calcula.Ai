import { useState } from 'react';
import Filters from '../Filters';

export default function FiltersExample() {
  const [month, setMonth] = useState('2025-11');
  const [type, setType] = useState<'all' | 'income' | 'expense'>('all');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const mockMonths = ['2025-11', '2025-10', '2025-09'];
  const mockCategories = [
    { id: '1', name: 'Salário', type: 'income' as const },
    { id: '2', name: 'Casa', type: 'expense' as const },
    { id: '3', name: 'Mercado', type: 'expense' as const },
  ];

  return (
    <div className="p-4">
      <Filters
        availableMonths={mockMonths}
        categories={mockCategories}
        selectedMonth={month}
        selectedType={type}
        selectedCategory={category}
        searchText={search}
        onMonthChange={setMonth}
        onTypeChange={setType}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
      />
    </div>
  );
}
