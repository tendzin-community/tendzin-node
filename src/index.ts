import fetch, { Response } from 'node-fetch';
import { Headers } from 'node-fetch';
import { format } from 'url';

import TendzinClientError from './TendzinClientError';
import TendzinClientRequestError from './TendzinClientRequestError';
import {
  ContiguousInventory,
  Event,
  GetClient,
  Inventory,
  Range,
  RequestOptions,
  Status,
  TendzinClient,
} from './types';

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

export = function getClient({ token, node }: GetClient = {}): TendzinClient {
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
    getContiguousInventory: async (uuid, options = {}) => {
      const { result } = await getRequest(`range/day/${uuid}/contiguous-inventories`, token, { host, ...options });
      return result;
    },
    getInventory: async (uuid, options = {}) => {
      const { result } = await getRequest(`range/day/${uuid}/inventories`, token, { host, ...options });
      return result;
    },
    getStatus: async (uuid, options = {}) => {
      const { result } = await getRequest(`range/day/${uuid}`, token, { host, ...options });
      return result;
    },
    spawn: async (options = {}) => {
      const { result } = await postRequest('range/day', token, null, { host, ...options });
      return result;
    },
    transact: async (events, uuid, options = {}) => {
      await patchRequest(`range/day/${uuid}`, token, { events }, { host, ...options });
      return true;
    },
  };
};
