import { type ZenotiClient } from "@/_internal/client";
import { ListAppointmentResponse } from "./types";

export class AppointmentService {

    constructor(private readonly zenoti: ZenotiClient) {}

    async getAll(start_date: string, end_date: string) {
        const response = await this.zenoti.getClient().get("/v1/appointments", {
            params: {
                center_id: this.zenoti.getCenterId(),
                start_date,
                end_date
            }
        });

        const data = await response.data as ListAppointmentResponse;
        return data;
    }
}
