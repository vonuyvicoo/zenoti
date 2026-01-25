import { ZenotiClient } from "@/_internal/client";
import { CreateGuestDto, SearchGuestDto } from "@/guests/dto";
import { ValidationError } from "@/errors";
import { GetGuestResponse, ListGuestsApiResponse, ListGuestsResponse, ListPurchasesResponse, SearchGuestResponse } from "./types";

export class GuestService {
    constructor(private readonly zenoti: ZenotiClient){}

    async create(payload: CreateGuestDto) {
        const response = await this.zenoti.getClient().post('/v1/guests', {
            ...payload,
            center_id: this.zenoti.getCenterId()
        });

        const data = await response.data;
        return data;
    }

    async search(payload: SearchGuestDto) {
        let someValueIsPresent = Object.values(payload).some((val) => val !== undefined);

        if(!someValueIsPresent) throw new ValidationError("Invalid values provided.");

        const response = await this.zenoti.getClient().get("/v1/guests/search", {
            params: {
                center_id: this.zenoti.getCenterId(),
                ...(payload.email ? { email: payload.email } : undefined ),
                ...(payload.first_name ? { first_name: payload.first_name} : undefined),
                ...(payload.last_name ? { last_name: payload.last_name} : undefined )
            }
        });
        
        const data = await response.data as SearchGuestResponse;
        
        return data;
    }

    async getAll(page?: number, size?: number) {
        // https://api.zenoti.com/v1/guests?center_id={center_id}&last_updated={date}
        const response = await this.zenoti.getClient().get(`/v1/guests`, {
            params: {
                center_id: this.zenoti.getCenterId(),
                page: page || 1,
                size: size || 10
            }
        });
        const apiData = await response.data as ListGuestsApiResponse;
        
        // Map API response (page_Info) to SDK response (page_info)
        const data: ListGuestsResponse = {
            guests: apiData.guests,
            page_info: apiData.page_Info
        };
        
        return data;
    }
    
    async get(guest_id: string) {
        // https://api.zenoti.com/v1/guests/{guest_id}
        const response = await this.zenoti.getClient().get(`/v1/guests/${guest_id}`);

        const data = await response.data as GetGuestResponse;
        return data;
    }

    async getPurchases(guest_id: string){
        const response = await this.zenoti.getClient().get(`/v1/guests/${guest_id}/products`);
        const data = await response.data as ListPurchasesResponse;
        return data;
    }
}
