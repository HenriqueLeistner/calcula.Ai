import { useEffect, useState, useMemo } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

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

function FinanceApp() {
  const { toast } = useToast();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgets, setShowBudgets] = useState(false);

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
      const [year, month] = filters.month.split('-');
      const tDate = new Date(t.date);
      const tMonth = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (tMonth !== filters.month) return false;
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
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let accumulated = 0;
    const dataPoints = sorted.map(t => {
      if (t.type === 'income') {
        accumulated += t.amount;
      } else {
        accumulated -= t.amount;
      }
      
      const date = new Date(t.date);
      return {
        date: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
        balance: accumulated,
      };
    });

    return [{ date: '00/00', balance: 0 }, ...dataPoints];
  }, [filteredTransactions]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    months.add(getCurrentMonth());
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">calcula.Ai</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {formatMonthYear(filters.month)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FileTransfer onExport={exportData} onImport={handleImport} />
            <Button onClick={() => setShowBudgets(!showBudgets)} variant="outline" size="sm" data-testid="button-budgets">
              <span className="hidden sm:inline">Orçamentos</span>
              <span className="sm:hidden">$</span>
            </Button>
            <Button onClick={() => setShowTransactionForm(true)} size="sm" data-testid="button-new-transaction">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Nova</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
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
      </main>

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
