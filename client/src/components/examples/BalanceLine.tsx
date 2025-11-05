import BalanceLine from '../Charts/BalanceLine';

export default function BalanceLineExample() {
  const mockData = [
    { date: '01/11', balance: 0 },
    { date: '05/11', balance: 5000 },
    { date: '10/11', balance: 4750 },
    { date: '15/11', balance: 4200 },
    { date: '20/11', balance: 3800 },
    { date: '25/11', balance: 3500 },
  ];

  return <BalanceLine data={mockData} />;
}
