import uuid1 from 'uuid/v1';

import { TendzinClient, Range, Event, Inventory, ContiguousInventory, Status, GetClient } from '../../src/types';

import TendzinClientError from '../../src/TendzinClientError';
import TendzinClientRequestError from '../../src/TendzinClientRequestError';

let __contiguousInventory: ContiguousInventory[] = []

let __inventory: Inventory[] = []

let __status: Status = {
  id: '',
  uptime: 0
}

interface MockTendzinClient extends TendzinClient {
  __setContiguousInventory: (contiguousInventory: ContiguousInventory[]) => void
  __setInventory: (inventory: Inventory[]) => void
  __setStatus: (status: Status) => void
}

export = function getClient({ token, node }: GetClient = {}): MockTendzinClient {
  if (!token) {
    throw new TendzinClientError(
      `missing property "token", login at tendzin.com and issue a token for node you wish to use`,
    );
  }

  if (!node) {
    throw new TendzinClientError(`missing property "node", try "sydney', "los-angeles" or "london" for example`);
  }

  return {
    getContiguousInventory: async (uuid, options = {}) => {
      return __contiguousInventory
    },
    __setContiguousInventory: (contiguousInventory) => {
      __contiguousInventory = contiguousInventory
    },
    getInventory: async (uuid, options = {}) => {
      return __inventory
    },
    __setInventory: (inventory) => {
      __inventory = inventory
    },
    getStatus: async (uuid, options = {}) => {
      return __status
    },
    __setStatus: (status) => {
      __status = status
    },
    spawn: async (options = {}) => {
      return {
        id: uuid1(),
        uptime: 0
      };
    },
    transact: async (events, uuid, options = {}) => {
      return true;
    },
  };
};
