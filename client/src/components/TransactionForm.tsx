import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { parseBRLInput } from '@/lib/currency';
import type { Category } from '@/lib/db';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: {
    type: 'income' | 'expense';
    date: string;
    category: string;
    description: string;
    amount: number;
  }) => void;
  onCancel?: () => void;
}

export default function TransactionForm({ categories, onSubmit, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(() => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    console.log('📅 Data padrão do formulário:', dateStr);
    return dateStr;
  });
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const filteredCategories = categories.filter(cat => cat.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseBRLInput(amount);
    
    if (!category || !description || parsedAmount <= 0) {
      return;
    }

    onSubmit({
      type,
      date,
      category,
      description,
      amount: parsedAmount,
    });

    setDescription('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={type === 'income' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => { setType('income'); setCategory(''); }}
          data-testid="button-income"
        >
          Receita
        </Button>
        <Button
          type="button"
          variant={type === 'expense' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => { setType('expense'); setCategory(''); }}
          data-testid="button-expense"
        >
          Despesa
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          data-testid="input-date"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category" data-testid="select-category">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Supermercado"
          required
          data-testid="input-description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input
          id="amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0,00"
          className="font-mono text-right"
          required
          data-testid="input-amount"
        />
      </div>

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1" data-testid="button-cancel">
            Cancelar
          </Button>
        )}
        <Button type="submit" className="flex-1" data-testid="button-submit">
          Adicionar
        </Button>
      </div>
    </form>
  );
}
