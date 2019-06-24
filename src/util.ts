export function formatDate(date: Date): string {
  return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}

export function addDays(date: Date, days: number) {
  return new Date(formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)));
}

export function addDay(date: Date) {
  return addDays(date, 1);
}

export function subtractDay(date: Date) {
  return addDays(date, -1);
}

export function getLastDate(date: Date, offset: number, months: number): Date {
  const month = date.getMonth() + offset + months;
  return new Date(formatDate(new Date(date.getFullYear(), month, 0)));
}

export function getFirstDate(date: Date, offset: number): Date {
  const month = date.getMonth() + offset;
  return new Date(formatDate(new Date(date.getFullYear(), month, 1)));
}

export function getToday(): Date {
  const now = new Date();
  return new Date(formatDate(now));
}

export function checkInAndNightsToDates(checkIn: string, nights: number) {
  const checkInDate = new Date(checkIn);
  const lastNightDate = addDays(checkInDate, nights - 1);
  return { checkInDate, lastNightDate };
}
