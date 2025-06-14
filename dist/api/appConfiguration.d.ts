export type AppConfigOptions = {
    appId: string;
    collectionId?: string;
    productId?: string;
    variantId?: string;
    batchId?: string;
    itemId?: string;
    user?: boolean;
    userData?: boolean;
    admin?: boolean;
    config?: any;
    data?: any;
};
export declare namespace appConfiguration {
    function getConfig(opts: AppConfigOptions): Promise<any>;
    function setConfig(opts: AppConfigOptions): Promise<any>;
    function deleteConfig(opts: AppConfigOptions): Promise<void>;
    function getData(opts: AppConfigOptions): Promise<any[]>;
    function getDataItem(opts: AppConfigOptions): Promise<any>;
    function setDataItem(opts: AppConfigOptions): Promise<any>;
    function deleteDataItem(opts: AppConfigOptions): Promise<void>;
}
