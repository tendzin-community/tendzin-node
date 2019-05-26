import fetch, { Response } from 'node-fetch';
import { Headers } from 'node-fetch';

interface Range {
  readonly upper: string;
  readonly lower: string;
}

interface Event {
  readonly range: Range;
  readonly delta: number;
  readonly operation: string;
  readonly column: string;
}

interface Inventory {
  readonly range: Range;
  readonly count: number;
  readonly total: number;
}

interface ContiguousInventory {
  readonly inventories: Inventory[];
}

interface Status {
  readonly id: string;
  readonly uptime: number;
}

interface RequestOptions {
  host: string;
  protocol: string;
  headers: any;
  body?: string;
  method: string;
}

interface GetClient {
  token?: string;
  node?: string;
}

const Accept = 'application/json';

const ContentType = 'application/json';

const ContentTypeReg = new RegExp(ContentType);

class TendzinClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class TendzinClientRequestError extends TendzinClientError {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status || 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

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
  const url = `${options.protocol}://${options.host}/${path}`;
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
    method,
    host: 'sydney.tendzin.com',
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

function postRequest(path: string, token: string, data: any, options: any) {
  return request(path, mergeOptions(options, token, data, 'post'));
}

function patchRequest(path: string, token: string, data: any, options: any) {
  console.log(data);
  return request(path, mergeOptions(options, token, data, 'patch'));
}

function getRequest(path: string, token: string, options: any) {
  return request(path, mergeOptions(options, token, null, 'get'));
}

export = function({ token, node }: GetClient = {}) {
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
    transact: async (events: Event[], uuid: string, options: any = {}): Promise<boolean> => {
      await patchRequest(`range/day/${uuid}`, token, { events }, { host, ...options });
      return true;
    },
    spawn: async (options: any = {}): Promise<Status> => {
      const { result } = await postRequest('range/day', token, null, { host, ...options });
      return result;
    },
    getInventory: async (uuid: string, options: any = {}): Promise<Inventory[]> => {
      const { result } = await getRequest(`range/day/${uuid}/inventories`, token, { host, ...options });
      return result;
    },
    getContiguousInventory: async (uuid: string, options: any = {}): Promise<ContiguousInventory[]> => {
      const { result } = await getRequest(`range/day/${uuid}/contiguous-inventories`, token, { host, ...options });
      return result;
    },
    getStatus: async (uuid: string, options: any = {}): Promise<Status> => {
      const { result } = await getRequest(`range/day/${uuid}`, token, { host, ...options });
      return result;
    },
  };
};
