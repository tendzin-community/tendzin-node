### Reservation Module

Using a transaction key is optional but recommended as it will make your
requests idempotent and prevent any double booking.

Create:

```ts
createReservation(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  transactionKey: '921e1804-b841-480b-b237-67076490accd',
  start: "2019-05-01",
  end: "2019-05-01",
});
```

Cancel:

```ts
cancelReseravation(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  transactionKey: '23cc2540-21f7-459a-ad0e-48401e4ea415',
  start: "2019-05-01",
  end: "2019-05-01",
});
```

Modify:

```ts
modifyReservation(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  transactionKey: '3130b91d-1f36-4964-8895-61aca8495449',
  from: {
    start: "2019-05-01",
    end: "2019-05-02",
  },
  to: {
    start: "2019-05-01",
    end: "2019-05-04",
  }
});
```
