import fetch, { Headers, Response } from 'node-fetch';
import { format } from 'url';

export class TendzinClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class TendzinClientRequestError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status || 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

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
  getContiguousInventory: (uuid: string, unit: string, options: any) => Promise<ContiguousInventory[]>;
  getInventory: (uuid: string, unit: string, options: any) => Promise<Inventory[]>;
  getStatus: (uuid: string, unit: string, options: any) => Promise<Status>;
  spawn: (unit: string, options?: any) => Promise<Status>;
  transact: (events: Event[], uuid: string, unit: string, options: any) => Promise<boolean>;
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

const Accept = 'application/json';

const ContentType = 'application/json';

const ContentTypeReg = new RegExp(ContentType);

function isJSONResponse(response: Response): boolean {
  const contentType = response.headers.get('content-type');

  if (!contentType) {
    return false;
  }

  const matchData = contentType.match(ContentTypeReg);

  if (!matchData) {
    return false;
  }

  return true;
}

async function request(path: string, options: RequestOptions): Promise<any> {
  const url = format({
    hostname: options.host,
    pathname: path,
    protocol: options.protocol,
    query: options.query,
  });

  const response = await fetch(url, { headers: options.headers, body: options.body, method: options.method });

  const isJSON = isJSONResponse(response);

  if (response.ok && isJSON) {
    const body = await response.json();
    return body;
  }

  if (response.ok) {
    return {};
  }

  if (isJSON) {
    const errors = await response.json();
    throw new TendzinClientRequestError(JSON.stringify(errors), response.status);
  }

  const text = await response.text();
  throw new TendzinClientRequestError(text, response.status);
}

function headers(token: string) {
  return {
    Accept,
    Authorization: `Bearer ${token}`,
    'Content-Type': ContentType,
  };
}

function mergeOptions(options: any, token: string, data: any, method: string): RequestOptions {
  const newOptions: RequestOptions = {
    host: 'sydney.tendzin.com',
    method,
    protocol: 'https',
    ...options,
    headers: {
      ...headers(token),
      ...options.headers,
    },
  };

  if (data) {
    newOptions.body = JSON.stringify(data);
  }

  return newOptions;
}

function postRequest(path: string, token: string, data: any, options: RequestOptions) {
  return request(path, mergeOptions(options, token, data, 'post'));
}

function patchRequest(path: string, token: string, data: any, options: RequestOptions) {
  return request(path, mergeOptions(options, token, data, 'patch'));
}

function getRequest(path: string, token: string, options: RequestOptions) {
  return request(path, mergeOptions(options, token, null, 'get'));
}

export function getClient({ token, node }: GetClient = {}): TendzinClient {
  if (!token) {
    throw new TendzinClientError(
      `missing property "token", login at tendzin.com and issue a token for node you wish to use`,
    );
  }

  if (!node) {
    throw new TendzinClientError(`missing property "node", try "sydney', "los-angeles" or "london" for example`);
  }

  const host = `${node}.tendzin.com`;

  return {
    getContiguousInventory: async (uuid, unit, options = {}) => {
      const { result } = await getRequest(`range/${unit}/${uuid}/contiguous-inventories`, token, { host, ...options });
      return result;
    },
    getInventory: async (uuid, unit, options = {}) => {
      const { result } = await getRequest(`range/${unit}/${uuid}/inventories`, token, { host, ...options });
      return result;
    },
    getStatus: async (uuid, unit, options = {}) => {
      const { result } = await getRequest(`range/${unit}/${uuid}`, token, { host, ...options });
      return result;
    },
    spawn: async (unit, options = {}) => {
      const { result } = await postRequest(`range/${unit}`, token, null, { host, ...options });
      return result;
    },
    transact: async (events, uuid, unit, options = {}) => {
      await patchRequest(`range/${unit}/${uuid}`, token, { events }, { host, ...options });
      return true;
    },
  };
}
