import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { Category } from '@/lib/db';

interface FiltersProps {
  availableMonths: string[];
  categories: Category[];
  selectedMonth: string;
  selectedType: 'all' | 'income' | 'expense';
  selectedCategory: string;
  searchText: string;
  onMonthChange: (month: string) => void;
  onTypeChange: (type: 'all' | 'income' | 'expense') => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
}

export default function Filters({
  availableMonths,
  categories,
  selectedMonth,
  selectedType,
  selectedCategory,
  searchText,
  onMonthChange,
  onTypeChange,
  onCategoryChange,
  onSearchChange,
}: FiltersProps) {
  const filteredCategories = selectedType === 'all' 
    ? categories 
    : categories.filter(cat => cat.type === selectedType);

  const displayCategory = selectedCategory || 'all';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="space-y-2">
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger data-testid="select-month">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {availableMonths.map((month) => (
              <SelectItem key={month} value={month}>
                {new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Select value={selectedType} onValueChange={(v) => onTypeChange(v as any)}>
          <SelectTrigger data-testid="select-type">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
            <SelectItem value="expense">Despesas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Select value={displayCategory} onValueChange={(v) => onCategoryChange(v === 'all' ? '' : v)}>
          <SelectTrigger data-testid="select-filter-category">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {filteredCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          data-testid="input-search"
        />
      </div>
    </div>
  );
}
