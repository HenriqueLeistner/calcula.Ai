import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/date';

interface ParsedTransaction {
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
}

function parseNaturalInput(input: string, categories: Array<{ id: string; name: string; type: 'income' | 'expense' }>): ParsedTransaction | null {
  const text = input.toLowerCase().trim();
  
  const amountMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:reais?|r\$|real)?/);
  if (!amountMatch) return null;
  
  const amount = parseFloat(amountMatch[1].replace(',', '.'));
  
  // Usar data de hoje sem problemas de timezone
  const today = new Date();
  let date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dateMatch) {
    const [_, day, month, year] = dateMatch;
    date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  let foundCategory = categories.find(cat => 
    text.includes(cat.name.toLowerCase())
  );
  
  if (!foundCategory) {
    const expenseCategories = categories.filter(c => c.type === 'expense');
    foundCategory = expenseCategories[0];
  }
  
  const words = text.split(/[,\s]+/).filter(w => 
    w && 
    !w.match(/^\d/) && 
    w !== 'reais' && 
    w !== 'real' && 
    w !== 'r$' &&
    !foundCategory?.name.toLowerCase().includes(w)
  );
  
  const description = words.slice(0, 3).join(' ') || foundCategory?.name || 'Transação';
  
  return {
    amount,
    category: foundCategory!.id,
    date,
    description: description.charAt(0).toUpperCase() + description.slice(1),
    type: foundCategory!.type,
  };
}

export function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const { categories, addTransaction } = useFinanceStore();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');

    const parsed = parseNaturalInput(userMessage, categories);

    if (!parsed) {
      setMessages(prev => [...prev, { 
        text: '❌ Não consegui entender. Tente: "50 reais, mercado, 12/04/2025"', 
        isUser: false 
      }]);
      return;
    }

    try {
      await addTransaction(parsed);
      
      const categoryName = categories.find(c => c.id === parsed.category)?.name;
      const formattedAmount = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(parsed.amount);
      
      setMessages(prev => [...prev, { 
        text: `✅ Transação adicionada: ${formattedAmount} em ${categoryName} para ${formatDate(parsed.date)}`, 
        isUser: false 
      }]);

      toast({
        title: "Transação adicionada",
        description: `${formattedAmount} em ${categoryName}`,
      });
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: '❌ Erro ao adicionar transação', 
        isUser: false 
      }]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-2">Chat Financeiro</h3>
            <p className="mb-4">Digite suas transações de forma natural</p>
            <div className="space-y-2 text-left max-w-xs mx-auto">
              <p className="text-xs font-medium">Exemplos:</p>
              <div className="bg-muted p-2 rounded text-xs">💰 "12 reais mercado"</div>
              <div className="bg-muted p-2 rounded text-xs">🍔 "45.50 lazer"</div>
              <div className="bg-muted p-2 rounded text-xs">💼 "3000 salário 01/05/2025"</div>
              <div className="bg-muted p-2 rounded text-xs">🏠 "800 casa"</div>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg text-sm max-w-[85%] ${
              msg.isUser
                ? 'bg-primary text-primary-foreground ml-auto'
                : 'bg-muted mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ex: 50 reais mercado"
            className="flex-1"
          />
          <Button onClick={handleSubmit} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
