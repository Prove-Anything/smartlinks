export declare namespace appRecord {
    function get(collectionId: string, appId: string): Promise<any>;
    function create(collectionId: string, appId: string, data: any): Promise<any>;
    function update(collectionId: string, appId: string, data: any): Promise<any>;
    function remove(collectionId: string, appId: string): Promise<void>;
}
