# Tendzin Node Client

Node client for interacting with Tendzin.

```
npm install tendzin
```

## Creating a client

To get a token log into tendzin.com and issue one for the relevant node:

```js
var client = require('tendzin')({ token: process.env.TOKEN, node: 'sydney' });
```

## Modules

### Calendar Module

The Calendar Module provides an API for generating a calendar for use in app.

* `months` is the amount of months you would like to be generated.
* use `offset` for pagination.
* `nights` are the number of nights you would like to stay.

```js
var client = require('tendzin')({ token: process.env.TOKEN, node: 'sydney' });

var calendar = require('tendzin/modules/calendar');

calendar.search(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  months: 1,
  offset: 0,
  nights: 1
}).then(function(days) {
  console.log(days)
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

client.transact(events, id).catch(function(error) {
  console.log(error)
})
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

client.transact(events, id, { headers: headers }).catch(function(error) {
  console.log(error)
})
```

### Get inventory

```js
client.getInventory(id).then(function(inventory) {
  console.log(inventory)
})
```

### Get contiguous inventory

```js
client.getContiguousInventory(id).then(function(contiguousInventory) {
  console.log(contiguousInventory)
})
```

### Create a new compute unit

```js
client.spawn().then(function(status) {
  console.log(status.id)
})
```
