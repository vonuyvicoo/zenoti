import { type ZenotiClient } from "@/_internal/client";
import { ListTherapistsResponse } from "./types";

export class TherapistService {
    constructor(private readonly zenoti: ZenotiClient) {}
    async getAll(){
        const response = await this.zenoti.getClient().get(`/v1/centers/:center_id/therapists`);

        const data = await response.data as ListTherapistsResponse;
        return data;
    }
}

