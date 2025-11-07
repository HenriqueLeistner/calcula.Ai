import { useEffect, useState, useMemo, useRef } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Menu, Download, Upload, DollarSign } from 'lucide-react';

import { initDB } from '@/lib/db';
import { useFinanceStore } from '@/store/useFinanceStore';
import { getCurrentMonth, formatMonthYear } from '@/lib/date';

import DashboardCards from '@/components/DashboardCards';
import TransactionForm from '@/components/TransactionForm';
import Filters from '@/components/Filters';
import TransactionsTable from '@/components/TransactionsTable';
import BudgetPanel from '@/components/BudgetPanel';
import ExpensesPie from '@/components/Charts/ExpensesPie';
import BalanceLine from '@/components/Charts/BalanceLine';
import InstallPrompt from '@/components/InstallPrompt';
import FileTransfer from '@/components/FileTransfer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SplashScreen } from '@/components/SplashScreen';
import { ChatPage } from '@/components/ChatPage';
import { Home, MessageSquare } from 'lucide-react';

function FinanceApp() {
  const { toast } = useToast();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgets, setShowBudgets] = useState(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'chat'>('home');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    transactions,
    categories,
    budgets,
    filters,
    isLoading,
    setFilters,
    loadTransactions,
    loadCategories,
    loadBudgets,
    addTransaction,
    deleteTransaction,
    setBudget,
    deleteBudget,
    exportData,
    importData,
  } = useFinanceStore();

  useEffect(() => {
    const init = async () => {
      // Limpar filtros antigos do localStorage
      localStorage.removeItem('finance-filters');
      
      await initDB();
      
      const db = await import('@/lib/db').then(m => m.getDB());
      const dbInstance = await db;
      
      const allTransactions = await dbInstance.getAll('transactions');
      const seedTransactions = allTransactions.filter(t => t.id.startsWith('seed-'));
      
      if (seedTransactions.length > 0) {
        const tx = dbInstance.transaction('transactions', 'readwrite');
        for (const transaction of seedTransactions) {
          await tx.store.delete(transaction.id);
        }
        await tx.done;
        
        const budgetTx = dbInstance.transaction('budgets', 'readwrite');
        await budgetTx.store.clear();
        await budgetTx.done;
      }
      
      await loadCategories();
      await loadTransactions();
      await loadBudgets();
    };
    init();
  }, [loadTransactions, loadCategories, loadBudgets]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Se tiver mês selecionado, filtra por ele
      if (filters.month) {
        // Parse da data sem timezone: extrai YYYY-MM diretamente da string
        const tMonth = t.date.substring(0, 7); // "2025-11-07" -> "2025-11"
        if (tMonth !== filters.month) return false;
      }
      
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      
      return true;
    });
  }, [transactions, filters]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const expensesByCategory = useMemo(() => {
    const result: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        result[t.category] = (result[t.category] || 0) + t.amount;
      });
    return result;
  }, [filteredTransactions]);

  const pieData = useMemo(() => {
    return Object.entries(expensesByCategory).map(([categoryId, value]) => ({
      name: categories.find(c => c.id === categoryId)?.name || categoryId,
      value,
    }));
  }, [expensesByCategory, categories]);

  const balanceData = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => 
      a.date.localeCompare(b.date) // Comparação de strings ISO já ordena corretamente
    );

    let accumulated = 0;
    const dataPoints = sorted.map(t => {
      if (t.type === 'income') {
        accumulated += t.amount;
      } else {
        accumulated -= t.amount;
      }
      
      // Parse da data sem timezone: extrai dia/mês diretamente da string
      const [year, month, day] = t.date.split('-');
      return {
        date: `${day}/${month}`,
        balance: accumulated,
      };
    });

    return [{ date: '00/00', balance: 0 }, ...dataPoints];
  }, [filteredTransactions]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    months.add(getCurrentMonth());
    
    transactions.forEach(t => {
      // Parse da data sem timezone: extrai YYYY-MM diretamente da string
      const month = t.date.substring(0, 7); // "2025-11-07" -> "2025-11"
      months.add(month);
    });
    
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const handleAddTransaction = async (data: any) => {
    try {
      await addTransaction(data);
      setShowTransactionForm(false);
      toast({
        title: "Transação adicionada",
        description: "A transação foi salva com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a transação.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Deseja realmente excluir esta transação?')) {
      try {
        await deleteTransaction(id);
        toast({
          title: "Transação excluída",
          description: "A transação foi removida com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir a transação.",
          variant: "destructive",
        });
      }
    }
  };

  const handleImport = async (data: string) => {
    try {
      await importData(data);
      toast({
        title: "Dados importados",
        description: "Os dados foram importados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao importar",
        description: "Não foi possível importar os dados. Verifique o arquivo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleExportClick = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seu-financas-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Dados exportados",
        description: "Os dados foram exportados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await handleImport(text);
    } catch (error) {
      // Error already handled in handleImport
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">calcula.Ai</h1>
            <p className="text-xs text-muted-foreground">
              {currentTab === 'home' 
                ? (filters.month ? formatMonthYear(filters.month) : 'Todos os meses')
                : 'Chat Financeiro'}
            </p>
          </div>
          {currentTab === 'home' && (
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setShowTransactionForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Transação
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowBudgets(!showBudgets)}>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Orçamentos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportClick}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Dados
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleImportClick}>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Dados
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {currentTab === 'chat' && (
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {currentTab === 'home' ? (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-20">
            <DashboardCards income={stats.income} expense={stats.expense} balance={stats.balance} />

            <Filters
              availableMonths={availableMonths}
              categories={categories}
              selectedMonth={filters.month}
              selectedType={filters.type}
              selectedCategory={filters.category}
              searchText={filters.search}
              onMonthChange={(month) => setFilters({ month })}
              onTypeChange={(type) => setFilters({ type })}
              onCategoryChange={(category) => setFilters({ category })}
              onSearchChange={(search) => setFilters({ search })}
            />

            {showBudgets ? (
              <BudgetPanel
                categories={categories}
                budgets={budgets}
                expensesByCategory={expensesByCategory}
                onSetBudget={setBudget}
                onDeleteBudget={deleteBudget}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ExpensesPie data={pieData} />
                  <BalanceLine data={balanceData} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">Transações</h2>
                  {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Carregando...</div>
                  ) : (
                    <TransactionsTable
                      transactions={filteredTransactions}
                      categories={categories}
                      onDelete={handleDeleteTransaction}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-full">
            <ChatPage />
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-around">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
              currentTab === 'home' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Inicial</span>
          </button>
          <button
            onClick={() => setCurrentTab('chat')}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
              currentTab === 'chat' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-medium">Chat</span>
          </button>
        </div>
      </nav>

      <Dialog open={showTransactionForm} onOpenChange={setShowTransactionForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
          </DialogHeader>
          <TransactionForm
            categories={categories}
            onSubmit={handleAddTransaction}
            onCancel={() => setShowTransactionForm(false)}
          />
        </DialogContent>
      </Dialog>

      <InstallPrompt />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <FinanceApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
