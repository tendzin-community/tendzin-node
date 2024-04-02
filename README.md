# Tendzin Node Client

Node client for interacting with Tendzin.

```
npm install tendzin
```

## Creating a client

To get a token log into tendzin.com and issue one for the relevant node:

```ts
import { getClient } from 'tendzin';
const client = getClient({ token: process.env.TOKEN, node: 'sydney' });
```

## Modules

* [Calendar](/docs/calendar.md)
* [Reservation](/docs/reservation.md)
* [Inventory](/docs/inventory.md)
