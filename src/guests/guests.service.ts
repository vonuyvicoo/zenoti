import { ZenotiClient } from "@/_internal/client";
import { CreateGuestDto, SearchGuestDto } from "@/guests/dto";
import { ValidationError } from "@/errors";
import { SearchGuestResponse } from "./types";

export class GuestService {
    constructor(private readonly zenoti: ZenotiClient){}

    async create(payload: CreateGuestDto) {
        const response = await this.zenoti.getClient().post('v1/guests', {
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
}
