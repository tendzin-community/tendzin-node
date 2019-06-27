import { TendzinClient } from '../../types';
import { formatDate } from '../../util';
import { UpdateTotalAvailableOptions } from './types';

export function updateTotalAvailable(client: TendzinClient, options: UpdateTotalAvailableOptions) {
  const id = options.id;

  const headers: any = {};

  if (options.transactionKey) {
    headers['tendzin-transaction-id'] = options.transactionKey;
  }

  const events = [
    {
      column: 'total',
      delta: options.total,
      operation: 'flatten',
      range: {
        lower: options.start,
        upper: options.end,
      },
    },
  ];

  return client.transact(events, id, { headers });
}
