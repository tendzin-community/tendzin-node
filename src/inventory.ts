import { TendzinClient } from './';
import { formatDate } from './util';

export interface UpdateTotalAvailableRange {
  start: string;
  end: string;
}

export interface UpdateTotalAvailableOptions {
  id: string;
  ranges: UpdateTotalAvailableRange[];
  total?: number;
  unit?: string;
  transactionKey?: string;
}

export function updateTotalAvailable(client: TendzinClient, options: UpdateTotalAvailableOptions): Promise<boolean> {
  const id = options.id;
  const unit = options.unit || 'day';
  const delta = options.total || 1;

  const headers: any = {};

  if (options.transactionKey) {
    headers['tendzin-transaction-id'] = options.transactionKey;
  }

  const events = options.ranges.map(range => ({
    column: 'total',
    delta,
    operation: 'flatten',
    range: {
      lower: range.start,
      upper: range.end,
    },
  }));

  return client.transact(events, id, unit, { headers });
}
