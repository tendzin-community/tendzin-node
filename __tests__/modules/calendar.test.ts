import uuid1 from 'uuid/v1';

import Tendzin from '../support/clientMock';
import * as calendar from '../../src/modules/calendar';
import { formatDate, addDays, getToday } from '../../src/util';

const client = Tendzin({
  token: 'f8c1c63f002740d6a837fa661bc2719f',
  node: 'sydney'
});

test('should return two check in dates', async () => {
  const todayDate = getToday();

  const inventory = {
    range: {
      upper: formatDate(addDays(todayDate, 2)),
      lower: formatDate(todayDate)
    },
    count: 0,
    total: 1
  }

  client.__setContiguousInventory([
    {
      inventories: [
        inventory
      ]
    }
  ]);

  const result = await calendar.search(client, {
    id: uuid1(),
    months: 1,
    offset: 0,
    nights: 1
  })

  const subject = result.filter(x => x.availableForCheckIn).length

  expect(subject).toEqual(2)
});

test('check if dates are available for check in', async () => {
  const todayDate = getToday();

  const upper = formatDate(addDays(todayDate, 2))
  const lower = formatDate(todayDate)

  const inventory = {
    range: {
      upper,
      lower
    },
    count: 0,
    total: 1
  }

  client.__setContiguousInventory([
    {
      inventories: [
        inventory
      ]
    }
  ]);

  const subject = await calendar.isAvailable(client, {
    id: uuid1(),
    checkIn: lower,
    nights: 2
  })

  expect(subject).toEqual(true)
});
