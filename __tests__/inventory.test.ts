import uuid1 from 'uuid/v1';

import { getClient } from './support/clientMock';
import * as inventory from '../src/inventory';

describe('inventory', () => {
  const client = getClient({
    token: 'f8c1c63f002740d6a837fa661bc2719f',
    node: 'sydney'
  });

  test('should update total available', async () => {
    const subject = await inventory.updateTotalAvailable(client, {
      id: uuid1(),
      transactionKey: uuid1(),
      start: "2019-05-01",
      end: "2019-06-01",
      total: 2
    })

    expect(subject).toEqual(true)
  });
});
