import uuid1 from 'uuid/v1';

import { getClient } from './support/clientMock';
import * as reservation from '../src/reservation';
import { formatDate, addDays, getToday } from '../src/util';

describe('reservation', () => {
  const client = getClient({
    token: 'f8c1c63f002740d6a837fa661bc2719f',
    node: 'sydney'
  });

  test('should create a reservation', async () => {
    const subject = await reservation.create(client, {
      id: uuid1(),
      start: "2020-01-01",
      end: "2020-01-01",
    })

    expect(subject).toEqual(true)
  });

  test('should create a reservation with transaction key', async () => {
    const subject = await reservation.create(client, {
      id: uuid1(),
      transactionKey: uuid1(),
      start: "2020-01-01",
      end: "2020-01-01",
    })

    expect(subject).toEqual(true)
  });

  test('should cancel a reservation', async () => {
    const subject = await reservation.cancel(client, {
      id: uuid1(),
      start: "2020-01-01",
      end: "2020-01-01",
    })

    expect(subject).toEqual(true)
  });

  test('should modify a reservation', async () => {
    const subject = await reservation.modify(client, {
      id: uuid1(),
      from: {
        start: "2020-01-01",
        end: "2020-01-01",
      },
      to: {
        start: "2020-01-02",
        end: "2020-01-03",
      }
    })

    expect(subject).toEqual(true)
  });
});
