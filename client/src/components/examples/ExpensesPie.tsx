import ExpensesPie from '../Charts/ExpensesPie';

export default function ExpensesPieExample() {
  const mockData = [
    { name: 'Casa', value: 1200 },
    { name: 'Mercado', value: 800 },
    { name: 'Transporte', value: 400 },
    { name: 'Lazer', value: 300 },
  ];

  return <ExpensesPie data={mockData} />;
}
