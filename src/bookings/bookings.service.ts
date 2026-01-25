import { type ZenotiClient } from "@/_internal/client";
import { CreateBookingDto } from "./dto";
import { ListSlotsResponse } from "./types";

export class BookingService {

    constructor(private readonly zenoti: ZenotiClient) {}

    async create(payload: CreateBookingDto) {
        
        const payloadSend = {
            center_id: this.zenoti.getCenterId(),
            date: payload.date,
            is_only_catalog_employees: true,
            guests: [
                {
                    id: payload.guests.id,
                    items: [
                        {
                            item: {
                                id: payload.guests.items.item_id
                            },
                            ...(payload.therapist_id ? {
                                therapist: {
                                    Id: payload.therapist_id
                                }
                            } : undefined)
                        }
                    ]
                }
            ]
        };

        const response = await this.zenoti.getClient().post("/v1/bookings?is_double_booking_enabled=false", payloadSend);
        const data = await response.data; // TODO add type
        return data;
    }
    
    async getSlots(booking_id: string) {
        const response = await this.zenoti.getClient().get(`/v1/bookings/${booking_id}/slots`);
        const data = await response.data as ListSlotsResponse;

        return data;
    }

    async reserve(booking_id: string, slot_time: string, create_invoice: boolean = false) {
        const payload = {
            slot_time,
            create_invoice
        }

        const response = await this.zenoti.getClient().post(`/v1/bookings/${booking_id}/slots/reserve`, payload);
        const data = await response.data;
        return data;
    }

    async confirm(booking_id: string, notes: string, group_name: string) {
        const payload = {
            notes,
            group_name
        };

        const response = await this.zenoti.getClient().post(`/v1/bookings/${booking_id}/slots/confirm`, payload);
        const data = await response.data;

        return data;

    }

}
