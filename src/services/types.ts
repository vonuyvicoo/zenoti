export interface Service {
    id: string;
    name: string;
    code: string;
    description: string;
    duration: string;
    price_info: {
        final_price: number;
    }
}

export type Price = {
    currency_id: number,
    sales: number,
    tax: number,
    final: number,
    final1: number,
    discount: number,
    tip: number,
    ssg: number | null,
    rounding_correction: number
} 

export type ListServicesResponse = {
    services: Service[];
}
