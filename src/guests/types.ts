export type PersonalInfo = {
    first_name: string;
    last_name: string;
    middle_name: string;
    preferred_name: string;
    email: string;
}

export type Guest = {
    id: string;
    center_name: string;
    personal_info: PersonalInfo 
}

export type SearchGuestResponse = {
    guests: Guest[];
    page_info: PageInfo;
}

export type Product = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    price_paid: number;
}

export type ListPurchasesResponse = {
    products: Product[]
}

export type ListGuestsResponse = {
    //https://docs.zenoti.com/reference/list-all-guests-of-a-center
    guests: Guest[],
    page_Info: PageInfo
}

export type PageInfo = {
    total: number;
    page: number;
    size: number;
}

export type GetGuestResponse = {
    // https://docs.zenoti.com/reference/retrieve-guest-details
    personal_info: PersonalInfo;
}
