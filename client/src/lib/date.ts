export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    // Parse ISO date string (YYYY-MM-DD) directly to avoid timezone issues
    const [year, month, day] = date.split('T')[0].split('-');
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  const d = date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatMonthYear(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

export function getMonthStart(yearMonth: string): Date {
  return new Date(`${yearMonth}-01T00:00:00`);
}

export function getMonthEnd(yearMonth: string): Date {
  const [year, month] = yearMonth.split('-');
  const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
  const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
  const endDate = new Date(`${nextYear}-${String(nextMonth).padStart(2, '0')}-01T00:00:00`);
  endDate.setMilliseconds(-1);
  return endDate;
}
