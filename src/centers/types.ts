export type Center = {
    id: string;
    code: string;
    name: string;
    display_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state_name?: string;
    country_name?: string;
    zip_code?: string;
    phone?: string;
    email?: string;
    time_zone?: string;
};

export type ListCentersResponse = {
    centers: Center[];
    page_info?: {
        total: number;
        page: number;
        size: number;
    };
};

/** One center's slice of a multi-center availability search. */
export type CenterAvailability = {
    center_id: string;
    /** Slot times returned by Zenoti for this center, in the center's local time. */
    slots: { Time: string; Priority?: number; Warnings?: unknown }[];
    /**
     * Set when this center's lookup failed. The rest of the search still
     * resolves, so one unreachable center cannot blank the whole page.
     */
    error?: { name: string; message: string };
};
