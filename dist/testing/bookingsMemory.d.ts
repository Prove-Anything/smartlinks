export interface BookingsMemory {
    slots: any[];
    bookings: any[];
    allocations: any[];
}
export declare function createBookingsMemory(): BookingsMemory;
export declare function bookingsMemoryImpl(mem: BookingsMemory, caller?: {
    contactId?: string | null;
}): {
    create(input?: any): Promise<any>;
    get(bookingId: string): Promise<any>;
    query(params?: any): Promise<{
        data: any[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            hasMore: boolean;
        };
    }>;
    mine(params?: any): Promise<{
        data: any[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            hasMore: boolean;
        };
    }>;
    update(bookingId: string, fields?: any): Promise<any>;
    confirm(bookingId: string): Promise<any>;
    cancel(bookingId: string, opts?: any): Promise<any>;
    move(bookingId: string, input?: any): Promise<any>;
    extendHold(bookingId: string, holdMinutes: number): Promise<any>;
    complete(bookingId: string): Promise<any>;
    noShow(bookingId: string): Promise<any>;
    freebusy(q?: any): Promise<{
        from: string;
        to: string;
        resources: any;
    }>;
    slots: {
        create(input?: any): Promise<any>;
        createMany(inputs: any[], opts?: any): Promise<any[]>;
        get(slotId: string): Promise<any>;
        query(params?: any): Promise<{
            data: any[];
            pagination: {
                total: number;
                limit: number;
                offset: number;
                hasMore: boolean;
            };
        }>;
        update(slotId: string, fields?: any): Promise<any>;
        delete(slotId: string): Promise<{
            success: boolean;
        }>;
    };
    blocks: {
        create(input?: any): Promise<any>;
        query(params?: any): Promise<{
            data: any[];
            pagination: {
                total: number;
                limit: number;
                offset: number;
                hasMore: boolean;
            };
        }>;
        delete(blockId: string): Promise<{
            success: boolean;
        }>;
    };
};
