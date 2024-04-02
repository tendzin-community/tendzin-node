import { ContiguousInventory, Range, TendzinClient } from './';
import { addDay, addDays, formatDate, getFirstDate, getLastDate, getToday, periodToDates, subtractDay } from './util';

export interface CalendarSearchOptions {
  id: string;
  months?: number;
  offset?: number;
  period?: number;
}

export interface CalendarSearchResult {
  available: boolean;
  start: string;
  end: string;
}

export interface IsAvailableOptions {
  id: string;
  start: string;
  end: string;
}

function inRange(date: Date, range: Range) {
  return date >= new Date(range.lower) && date <= new Date(range.upper);
}

function containing(startDate: Date, endDate: Date, range: Range) {
  return inRange(startDate, range) && inRange(endDate, range);
}

function containedInContiguousInventory(startDate: Date, endDate: Date, contiguousInventories: ContiguousInventory[]) {
  return !!contiguousInventories.find(group => {
    const inventories = group.inventories;
    return containing(startDate, endDate, {
      lower: inventories[0].range.lower,
      upper: inventories[inventories.length - 1].range.upper,
    });
  });
}

function getDates(firstDate: Date, lastDate: Date): Date[] {
  const days = [firstDate];
  let dayDate = new Date(firstDate.getTime());

  while (dayDate < lastDate) {
    dayDate = addDay(dayDate);
    days.push(dayDate);
  }

  return days;
}

function details(contiguousInventories: ContiguousInventory[], startDate: Date, period: number) {
  const endDate = addDays(startDate, period - 1);
  return {
    available: containedInContiguousInventory(startDate, endDate, contiguousInventories),
    end: formatDate(endDate),
    start: formatDate(startDate),
  };
}

export async function isAvailable(client: TendzinClient, options: IsAvailableOptions): Promise<boolean> {
  const startDate = new Date(options.start);
  const endDate = new Date(options.end);

  const contiguousInventories = await client.getContiguousInventory(options.id, 'day', {
    query: {
      'total-minus-count-gt': 0,
      'upper-range-gte': formatDate(startDate),
    },
  });

  return containedInContiguousInventory(startDate, endDate, contiguousInventories);
}

export async function search(client: TendzinClient, options: CalendarSearchOptions): Promise<CalendarSearchResult[]> {
  const months = options.months || 1;
  const offset = options.offset || 0;
  const period = options.period || 1;

  if (period < 1) {
    throw new Error('period must be 1 or more');
  }

  const todayDate = getToday();
  const firstDate = getFirstDate(todayDate, offset);
  const lastDate = getLastDate(todayDate, offset, months);

  const dates = getDates(firstDate, lastDate);

  const contiguousInventories = await client.getContiguousInventory(options.id, 'day', {
    query: {
      'total-minus-count-gt': 0,
      'upper-range-gte': formatDate(todayDate),
    },
  });

  return dates.map((date: Date) => details(contiguousInventories, date, period));
}
