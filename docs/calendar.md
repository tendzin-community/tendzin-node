### Calendar Module

The Calendar Module provides an API for generating a calendar for use in app.

* `months` is the amount of months you would like to be generated.
* use `offset` for pagination.
* `period` are the number of days you would like to query.

```ts
search(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  months: 1,
  offset: 0
});
```

This this example would return this:

```ts
[
  {
    "available": false,
    "start": "2019-05-31",
    "end": "2019-05-31",
  },
  {
    "available": true,
    "start": "2019-05-31",
    "end": "2019-05-31",
  }
  // ....
]
```

If you want to enquire if a particular date is available for day:

```ts
isAvailable(client, {
  id: 'c360e637-683f-4198-9c39-e73e81bbe232',
  start: "2019-05-01",
  end: "2019-06-02",
});
```
