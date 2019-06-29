# Tendzin Node Client

Node client for interacting with Tendzin.

```
npm install tendzin
```

## Creating a client

To get a token log into tendzin.com and issue one for the relevant node:

```js
var tendzin = require('tendzin');
var client = tendzin.getClient({ token: process.env.TOKEN, node: 'sydney' });
```

## Modules

### Calendar Module

The Calendar Module provides an API for generating a calendar for use in app.

* `months` is the amount of months you would like to be generated.
* use `offset` for pagination.
* `nights` are the number of nights you would like to stay.

```js
tendzin.calendar.search(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  months: 1,
  offset: 0,
  nights: 1
});
```

This this example would return this:

```js
[
  {
    "availableForCheckIn": false,
    "checkIn": "2019-05-31",
    "checkOut": "2019-06-01",
    "lastNight": "2019-05-31"
  },
  {
    "availableForCheckIn": false,
    "checkIn": "2019-06-01",
    "checkOut": "2019-06-02",
    "lastNight": "2019-06-01"
  }
  // ....
]
```

If you want to enquire if a particular date is available for check in:

```js
tendzin.calendar.isAvailable(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  checkIn: "2019-05-01",
  nights: 2
});
```

### Reservation Module

Using a transaction key is optional but recommended as it will make your
requests idempotent and prevent any double booking.

Create:

```js
tendzin.reservation.create(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  transactionKey: '921e1804-b841-480b-b237-67076490accd',
  checkIn: "2019-05-01",
  nights: 2,
});
```

Cancel:

```js
tendzin.reservation.cancel(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  transactionKey: '23cc2540-21f7-459a-ad0e-48401e4ea415',
  checkIn: "2019-05-01",
  nights: 2
});
```

Modify:

```js
tendzin.reservation.modify(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  transactionKey: '3130b91d-1f36-4964-8895-61aca8495449',
  from: {
    checkIn: "2019-05-01",
    nights: 2
  },
  to: {
    checkIn: "2019-05-01",
    nights: 4
  }
});
```

### Inventory Module

```js
tendzin.inventory.updateTotalAvailable(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  transactionKey: '3130b91d-1f36-4964-8895-61aca8495449',
  start: "2019-05-01",
  end: "2019-06-01",
  total: 2
})
```

## Using Client Directly

### Transact with a compute unit

No response on a successful transaction.

```js
var id = 'c360e637-683f-4198-9c39-e73e81bbe232'

var events = [
  {
    column: 'total',
    operation: 'flatten',
    delta: 9,
    range: {
      upper: '2019-08-03',
      lower: '2019-08-01'
    }
  }
]

client.transact(events, id, 'day')
```

Transaction ids are also supported to make your requests idempotent:

```js
var id = 'c360e637-683f-4198-9c39-e73e81bbe232'

var headers = {
  'tendzin-transaction-id': '48809764-57df-4858-bfc9-83207380714d'
}

var events = [
  {
    column: 'total',
    operation: 'flatten',
    delta: 9,
    range: {
      upper: '2019-08-03',
      lower: '2019-08-01'
    }
  }
]

client.transact(events, id, 'day', { headers: headers });
```

### Get inventory

```js
client.getInventory(id, 'day');
```

### Get contiguous inventory

```js
client.getContiguousInventory(id, 'day');
```

### Create a new compute unit

```js
client.spawn('day');
```
