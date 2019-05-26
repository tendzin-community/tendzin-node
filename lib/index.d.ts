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
interface GetClient {
    token?: string;
    node?: string;
}
declare const _default: ({ token, node }?: GetClient) => {
    transact: (events: Event[], uuid: string, options?: any) => Promise<boolean>;
    spawn: (options?: any) => Promise<Status>;
    getInventory: (uuid: string, options?: any) => Promise<Inventory[]>;
    getContiguousInventory: (uuid: string, options?: any) => Promise<ContiguousInventory[]>;
    getStatus: (uuid: string, options?: any) => Promise<Status>;
};
export = _default;
