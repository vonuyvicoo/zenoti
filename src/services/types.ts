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
