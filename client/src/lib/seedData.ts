import { getDB, type Transaction } from './db';

export async function addSeedData() {
  const db = await getDB();
  
  // Check if we already have transactions
  const existing = await db.getAll('transactions');
  if (existing.length > 0) return;

  // Seed transactions for the current month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const seedTransactions: Transaction[] = [
    // Income
    {
      id: 'seed-1',
      type: 'income',
      date: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
      category: 'cat-income-salary',
      description: 'Salário do mês',
      amount: 5000
    },
    {
      id: 'seed-2',
      type: 'income',
      date: new Date(currentYear, currentMonth, 15).toISOString().split('T')[0],
      category: 'cat-income-freelance',
      description: 'Projeto freelance',
      amount: 1200
    },
    // Expenses
    {
      id: 'seed-3',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 2).toISOString().split('T')[0],
      category: 'cat-expense-housing',
      description: 'Aluguel',
      amount: 1500
    },
    {
      id: 'seed-4',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 5).toISOString().split('T')[0],
      category: 'cat-expense-groceries',
      description: 'Supermercado Extra',
      amount: 450
    },
    {
      id: 'seed-5',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 7).toISOString().split('T')[0],
      category: 'cat-expense-transport',
      description: 'Combustível',
      amount: 250
    },
    {
      id: 'seed-6',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 10).toISOString().split('T')[0],
      category: 'cat-expense-leisure',
      description: 'Cinema',
      amount: 80
    },
    {
      id: 'seed-7',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 12).toISOString().split('T')[0],
      category: 'cat-expense-groceries',
      description: 'Mercado São José',
      amount: 320
    },
    {
      id: 'seed-8',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 15).toISOString().split('T')[0],
      category: 'cat-expense-health',
      description: 'Farmácia',
      amount: 150
    },
    {
      id: 'seed-9',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 18).toISOString().split('T')[0],
      category: 'cat-expense-leisure',
      description: 'Restaurante',
      amount: 180
    },
    {
      id: 'seed-10',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 20).toISOString().split('T')[0],
      category: 'cat-expense-education',
      description: 'Curso online',
      amount: 200
    },
    {
      id: 'seed-11',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 22).toISOString().split('T')[0],
      category: 'cat-expense-transport',
      description: 'Uber',
      amount: 45
    },
    {
      id: 'seed-12',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 25).toISOString().split('T')[0],
      category: 'cat-expense-groceries',
      description: 'Padaria',
      amount: 95
    },
  ];

  // Add seed transactions
  const tx = db.transaction('transactions', 'readwrite');
  for (const transaction of seedTransactions) {
    await tx.store.add(transaction);
  }
  await tx.done;

  // Add some budget examples
  const budgetTx = db.transaction('budgets', 'readwrite');
  await budgetTx.store.put({ id: 'cat-expense-housing', limit: 1600 });
  await budgetTx.store.put({ id: 'cat-expense-groceries', limit: 1000 });
  await budgetTx.store.put({ id: 'cat-expense-transport', limit: 400 });
  await budgetTx.done;

  console.log('✅ Dados de exemplo adicionados com sucesso!');
}
