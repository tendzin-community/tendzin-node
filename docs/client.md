## Using Client Directly

### Transact with a compute unit

No response on a successful transaction.

```ts
const id = 'c360e637-683f-4198-9c39-e73e81bbe232'

const events = [
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

```ts
const id = 'c360e637-683f-4198-9c39-e73e81bbe232'

const headers = {
  'tendzin-transaction-id': '48809764-57df-4858-bfc9-83207380714d'
}

const events = [
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

```ts
client.getInventory(id, 'day');
```

### Get contiguous inventory

```ts
client.getContiguousInventory(id, 'day');
```

### Create a new compute unit

```ts
client.spawn('day');
```
