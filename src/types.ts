export interface RequestOptions {
  host: string;
  protocol: string;
  headers: any;
  body?: string;
  query?: any;
  method: string;
}

export interface GetClient {
  token?: string;
  node?: string;
}

export interface TendzinClient {
  getContiguousInventory: (uuid: string, options: any) => Promise<ContiguousInventory[]>;
  getInventory: (uuid: string, options: any) => Promise<Inventory[]>;
  getStatus: (uuid: string, options: any) => Promise<Status>;
  spawn: (options?: any) => Promise<Status>;
  transact: (events: Event[], uuid: string, options: any) => Promise<boolean>;
}

export interface Range {
  readonly upper: string;
  readonly lower: string;
}

export interface Event {
  readonly range: Range;
  readonly delta: number;
  readonly operation: string;
  readonly column: string;
}

export interface Inventory {
  readonly range: Range;
  readonly count: number;
  readonly total: number;
}

export interface ContiguousInventory {
  readonly inventories: Inventory[];
}

export interface Status {
  readonly id: string;
  readonly uptime: number;
}
