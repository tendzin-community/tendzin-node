import { TendzinClient } from './';

interface RequestOptions {
  id: string;
  transactionKey?: string;
}

interface CheckInOptions {
  start: string;
  end: string;
}

export interface CreateReservationOptions extends RequestOptions, CheckInOptions {}

export interface CancelReservationOptions extends RequestOptions, CheckInOptions {}

export interface ModifyReservationOptions extends RequestOptions {
  from: CheckInOptions;
  to: CheckInOptions;
}

export function create(client: TendzinClient, options: CreateReservationOptions): Promise<boolean> {
  const id = options.id;
  const headers: any = {};

  if (options.transactionKey) {
    headers['tendzin-transaction-id'] = options.transactionKey;
  }

  const events = [
    {
      column: 'count',
      delta: 1,
      operation: 'increment',
      range: {
        lower: options.start,
        upper: options.end,
      },
    },
  ];

  return client.transact(events, id, 'day', { headers });
}

export async function cancel(client: TendzinClient, options: CancelReservationOptions): Promise<boolean> {
  const id = options.id;

  const headers: any = {};

  if (options.transactionKey) {
    headers['tendzin-transaction-id'] = options.transactionKey;
  }

  const events = [
    {
      column: 'count',
      delta: 1,
      operation: 'decrement',
      range: {
        lower: options.start,
        upper: options.end,
      },
    },
  ];

  return client.transact(events, id, 'day', { headers });
}

export async function modify(client: TendzinClient, options: ModifyReservationOptions): Promise<boolean> {
  const id = options.id;

  const headers: any = {};

  if (options.transactionKey) {
    headers['tendzin-transaction-id'] = options.transactionKey;
  }

  const events = [
    {
      column: 'count',
      delta: 1,
      operation: 'decrement',
      range: {
        lower: options.from.start,
        upper: options.from.end,
      },
    },
    {
      column: 'count',
      delta: 1,
      operation: 'increment',
      range: {
        lower: options.to.start,
        upper: options.to.end,
      },
    },
  ];

  return client.transact(events, id, 'day', { headers });
}
