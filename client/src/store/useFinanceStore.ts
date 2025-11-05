import { create } from 'zustand';
import { getDB, type Transaction, type Category, type Budget } from '@/lib/db';
import { getCurrentMonth } from '@/lib/date';

interface Filters {
  month: string;
  type: 'all' | 'income' | 'expense';
  category: string;
  search: string;
}

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  filters: Filters;
  isLoading: boolean;

  setFilters: (filters: Partial<Filters>) => void;
  loadTransactions: () => Promise<void>;
  loadCategories: () => Promise<void>;
  loadBudgets: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  setBudget: (categoryId: string, limit: number) => Promise<void>;
  deleteBudget: (categoryId: string) => Promise<void>;
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  categories: [],
  budgets: [],
  filters: {
    month: getCurrentMonth(),
    type: 'all',
    category: '',
    search: '',
  },
  isLoading: false,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    localStorage.setItem('finance-filters', JSON.stringify(get().filters));
  },

  loadTransactions: async () => {
    set({ isLoading: true });
    try {
      const db = await getDB();
      const allTransactions = await db.getAll('transactions');
      set({ transactions: allTransactions });
    } finally {
      set({ isLoading: false });
    }
  },

  loadCategories: async () => {
    const db = await getDB();
    const categories = await db.getAll('categories');
    set({ categories });
  },

  loadBudgets: async () => {
    const db = await getDB();
    const budgets = await db.getAll('budgets');
    set({ budgets });
  },

  addTransaction: async (transaction) => {
    const db = await getDB();
    const newTransaction = { ...transaction, id: v4() };
    await db.add('transactions', newTransaction);
    await get().loadTransactions();
  },

  updateTransaction: async (id, updates) => {
    const db = await getDB();
    const existing = await db.get('transactions', id);
    if (existing) {
      await db.put('transactions', { ...existing, ...updates });
      await get().loadTransactions();
    }
  },

  deleteTransaction: async (id) => {
    const db = await getDB();
    await db.delete('transactions', id);
    await get().loadTransactions();
  },

  addCategory: async (category) => {
    const db = await getDB();
    const newCategory = { ...category, id: v4() };
    await db.add('categories', newCategory);
    await get().loadCategories();
  },

  deleteCategory: async (id) => {
    const db = await getDB();
    await db.delete('categories', id);
    await get().loadCategories();
  },

  setBudget: async (categoryId, limit) => {
    const db = await getDB();
    await db.put('budgets', { id: categoryId, limit });
    await get().loadBudgets();
  },

  deleteBudget: async (categoryId) => {
    const db = await getDB();
    await db.delete('budgets', categoryId);
    await get().loadBudgets();
  },

  exportData: async () => {
    const db = await getDB();
    const data = {
      transactions: await db.getAll('transactions'),
      categories: await db.getAll('categories'),
      budgets: await db.getAll('budgets'),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData: async (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      const db = await getDB();

      if (data.transactions) {
        const tx = db.transaction('transactions', 'readwrite');
        for (const transaction of data.transactions) {
          await tx.store.put(transaction);
        }
        await tx.done;
      }

      if (data.categories) {
        const tx = db.transaction('categories', 'readwrite');
        for (const category of data.categories) {
          await tx.store.put(category);
        }
        await tx.done;
      }

      if (data.budgets) {
        const tx = db.transaction('budgets', 'readwrite');
        for (const budget of data.budgets) {
          await tx.store.put(budget);
        }
        await tx.done;
      }

      await get().loadTransactions();
      await get().loadCategories();
      await get().loadBudgets();
    } catch (error) {
      throw new Error('Erro ao importar dados. Verifique o arquivo JSON.');
    }
  },
}));

function v4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
