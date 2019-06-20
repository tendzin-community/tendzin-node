import { TendzinClient } from '../../types';
import { addDays, checkInAndNightsToDates, formatDate } from '../../util';
import { CancelReservationOptions, CreateReservationOptions, ModifyReservationOptions } from './types';

export function create(client: TendzinClient, options: CreateReservationOptions): Promise<boolean> {
  const id = options.id

  const headers: any = { }

  if (options.transactionKey) {
    headers['tendzin-transaction-id'] = options.transactionKey
  }

  const { checkInDate, lastNightDate } = checkInAndNightsToDates(
    options.checkIn,
    options.nights
  )

  const events = [
    {
      column: 'count',
      delta: 1,
      operation: 'increment',
      range: {
        lower: formatDate(checkInDate),
        upper: formatDate(lastNightDate)
      }
    }
  ]

  return client.transact(events, id, { headers });
}

export async function cancel(client: TendzinClient, options: CancelReservationOptions): Promise<boolean> {
  const id = options.id

  const headers: any = { }

  if (options.transactionKey) {
    headers['tendzin-transaction-id'] = options.transactionKey
  }

  const { checkInDate, lastNightDate } = checkInAndNightsToDates(
    options.checkIn,
    options.nights
  )

  const events = [
    {
      column: 'count',
      delta: 1,
      operation: 'decrement',
      range: {
        lower: formatDate(checkInDate),
        upper: formatDate(lastNightDate)
      }
    }
  ]

  return client.transact(events, id, { headers });
}

export async function modify(client: TendzinClient, options: ModifyReservationOptions): Promise<boolean> {
  const id = options.id

  const headers: any = { }

  if (options.transactionKey) {
    headers['tendzin-transaction-id'] = options.transactionKey
  }

  const { checkInDate: checkInDateFrom, lastNightDate: lastNightDateFrom } = checkInAndNightsToDates(
    options.from.checkIn,
    options.from.nights
  )

  const { checkInDate: checkInDateTo, lastNightDate: lastNightDateTo } = checkInAndNightsToDates(
    options.to.checkIn,
    options.to.nights
  )

  const events = [
    {
      column: 'count',
      delta: 1,
      operation: 'decrement',
      range: {
        lower: formatDate(checkInDateFrom),
        upper: formatDate(lastNightDateFrom)
      }
    },
    {
      column: 'count',
      delta: 1,
      operation: 'increment',
      range: {
        lower: formatDate(checkInDateTo),
        upper: formatDate(lastNightDateTo)
      }
    }
  ]

  return client.transact(events, id, { headers });
}
