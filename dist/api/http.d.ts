export declare namespace http {
    /**
     * Perform a GET request to any API endpoint.
     *
     * @param path - Path after the base URL, e.g. `'/public/config/fields'`
     * @returns Parsed JSON response body typed as `T`
     * @throws {SmartlinksApiError} on non-2xx responses
     *
     * @example
     * const fields = await http.get<FieldDefinition[]>('/public/config/fields')
     */
    function get<T>(path: string): Promise<T>;
    /**
     * Perform a POST request to any API endpoint.
     *
     * @param path  - Path after the base URL, e.g. `'/public/app/eticket/uploadTickets'`
     * @param body  - Request body (serialized to JSON, or sent as-is for FormData)
     * @returns Parsed JSON response body typed as `T`
     * @throws {SmartlinksApiError} on non-2xx responses
     *
     * @example
     * const result = await http.post('/public/app/eticket/uploadTickets', {
     *   collectionId,
     *   productId,
     *   appId,
     *   data,
     * })
     */
    function post<T>(path: string, body: any): Promise<T>;
    /**
     * Perform a PUT request to any API endpoint.
     *
     * @param path - Path after the base URL
     * @param body - Request body (serialized to JSON, or sent as-is for FormData)
     * @returns Parsed JSON response body typed as `T`
     * @throws {SmartlinksApiError} on non-2xx responses
     */
    function put<T>(path: string, body: any): Promise<T>;
    /**
     * Perform a PATCH request to any API endpoint.
     *
     * @param path - Path after the base URL
     * @param body - Partial request body (serialized to JSON)
     * @returns Parsed JSON response body typed as `T`
     * @throws {SmartlinksApiError} on non-2xx responses
     */
    function patch<T>(path: string, body: any): Promise<T>;
    /**
     * Perform a DELETE request to any API endpoint.
     *
     * @param path - Path after the base URL
     * @returns Parsed JSON response body typed as `T`
     * @throws {SmartlinksApiError} on non-2xx responses
     */
    function del<T>(path: string): Promise<T>;
}
