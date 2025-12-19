import type { ListBroadcastsQuery, BroadcastRecord, BroadcastList } from "../types/broadcasts";
export declare namespace broadcasts {
    function create(collectionId: string, body: Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>): Promise<BroadcastRecord>;
    function list(collectionId: string, query?: ListBroadcastsQuery): Promise<BroadcastList>;
    function get(collectionId: string, id: string): Promise<BroadcastRecord>;
    function update(collectionId: string, id: string, body: Partial<Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>>): Promise<BroadcastRecord>;
    function remove(collectionId: string, id: string): Promise<void>;
}
