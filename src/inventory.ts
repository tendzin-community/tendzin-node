import { TendzinClient } from './';
import { formatDate } from './util';

export interface UpdateTotalAvailableOptions {
  id: string;
  transactionKey?: string;
  start: string;
  end: string;
  total?: number;
  unit?: string;
}

export function updateTotalAvailable(client: TendzinClient, options: UpdateTotalAvailableOptions): Promise<boolean> {
  const id = options.id;
  const unit = options.unit || 'day';
  const delta = options.total || 1;

  const headers: any = {};

  if (options.transactionKey) {
    headers['tendzin-transaction-id'] = options.transactionKey;
  }

  const events = [
    {
      column: 'total',
      delta,
      operation: 'flatten',
      range: {
        lower: options.start,
        upper: options.end,
      },
    },
  ];

  return client.transact(events, id, unit, { headers });
}
