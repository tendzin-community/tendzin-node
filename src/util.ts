export function zeroHours(date: Date): Date {
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export function formatDate(date: Date): string {
  return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}

export function addDays(date: Date, days: number) {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

export function addDay(date: Date) {
  return addDays(date, 1);
}

export function subtractDay(date: Date) {
  return addDays(date, -1);
}

export function getFirstDate(date: Date, offset: number, months: number): Date {
  const firstDayMonth = date.getMonth() + offset + months - 1;
  const firstDay = new Date(date.getFullYear(), firstDayMonth, 1, 0, 0);
  return zeroHours(firstDay);
}

export function getLastDate(date: Date, offset: number): Date {
  const lastDayMonth = date.getMonth() + offset + 1;
  const lastDay = new Date(date.getFullYear(), lastDayMonth, 0);
  return zeroHours(lastDay);
}

export function getToday(): Date {
  return zeroHours(new Date());
}
