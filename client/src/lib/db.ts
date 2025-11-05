import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'calcula_ai';
const DB_VERSION = 1;

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  date: string;
  category: string;
  description: string;
  amount: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  limit: number;
}

export interface Meta {
  key: string;
  value: any;
}

let dbInstance: IDBPDatabase | null = null;

export async function initDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('transactions')) {
        const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
        transactionStore.createIndex('date', 'date');
        transactionStore.createIndex('type', 'type');
      }

      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('budgets')) {
        db.createObjectStore('budgets', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
    },
  });

  await seedDefaultCategories(dbInstance);
  return dbInstance;
}

async function seedDefaultCategories(db: IDBPDatabase) {
  const existingCategories = await db.getAll('categories');
  if (existingCategories.length > 0) return;

  const defaultCategories: Category[] = [
    { id: 'cat-income-salary', name: 'Salário', type: 'income' },
    { id: 'cat-income-freelance', name: 'Freelance', type: 'income' },
    { id: 'cat-income-investments', name: 'Investimentos', type: 'income' },
    { id: 'cat-expense-housing', name: 'Casa', type: 'expense' },
    { id: 'cat-expense-groceries', name: 'Mercado', type: 'expense' },
    { id: 'cat-expense-leisure', name: 'Lazer', type: 'expense' },
    { id: 'cat-expense-health', name: 'Saúde', type: 'expense' },
    { id: 'cat-expense-transport', name: 'Transporte', type: 'expense' },
    { id: 'cat-expense-education', name: 'Educação', type: 'expense' },
  ];

  const tx = db.transaction('categories', 'readwrite');
  for (const category of defaultCategories) {
    await tx.store.add(category);
  }
  await tx.done;
}

export async function getDB() {
  if (!dbInstance) {
    await initDB();
  }
  return dbInstance!;
}
