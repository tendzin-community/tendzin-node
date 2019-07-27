import { ContiguousInventory, Range, TendzinClient } from '../../types';
import {
  addDay,
  addDays,
  checkInAndNightsToDates,
  formatDate,
  getFirstDate,
  getLastDate,
  getToday,
  subtractDay,
} from '../../util';
import { CalendarSearchOptions, CalendarSearchResult, IsAvailableQuery } from './types';

function inRange(date: Date, range: Range) {
  return date >= new Date(range.lower) && date <= new Date(range.upper);
}

function containing(checkInDate: Date, lastNightDate: Date, range: Range) {
  return inRange(checkInDate, range) && inRange(lastNightDate, range);
}

function containedInContiguousInventory(
  checkInDate: Date,
  lastNightDate: Date,
  contiguousInventories: ContiguousInventory[],
) {
  return !!contiguousInventories.find(group => {
    const inventories = group.inventories;
    return containing(checkInDate, lastNightDate, {
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

function checkInDetails(contiguousInventories: ContiguousInventory[], checkInDate: Date, nights: number) {
  const checkOutDate = addDays(checkInDate, nights);
  const lastNightDate = addDays(checkInDate, nights - 1);
  return {
    availableForCheckIn: containedInContiguousInventory(checkInDate, lastNightDate, contiguousInventories),
    checkIn: formatDate(checkInDate),
    checkOut: formatDate(checkOutDate),
    lastNight: formatDate(lastNightDate),
  };
}

export async function isAvailable(client: TendzinClient, options: IsAvailableQuery): Promise<boolean> {
  const { checkInDate, lastNightDate } = checkInAndNightsToDates(options.checkIn, options.nights);

  const contiguousInventories = await client.getContiguousInventory(options.id, 'day', {
    query: {
      'total-minus-count-gt': 0,
      'upper-range-gte': formatDate(checkInDate),
    },
  });

  return containedInContiguousInventory(checkInDate, lastNightDate, contiguousInventories);
}

export async function search(client: TendzinClient, options: CalendarSearchOptions): Promise<CalendarSearchResult[]> {
  const months = options.months || 1;
  const offset = options.offset || 0;
  const nights = options.nights || 1;

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

  return dates.map((date: Date) => checkInDetails(contiguousInventories, date, nights));
}
