import { type ZenotiClient } from "@/_internal/client";
import { ZenotiError } from "@/errors";
import { CenterAvailability, Center, ListCentersResponse } from "./types";

export type SearchAvailabilityOptions = {
    /** Centers to search. Defaults to every center on the account. */
    centerIds?: string[];
    /** Service to look for, passed through to the booking payload. */
    serviceId: string;
    /** Date to search, `YYYY-MM-DD`. */
    date: string;
    /** Optional specific therapist. */
    therapistId?: string;
    /** Guest the booking is created against. */
    guestId: string;
    /**
     * Maximum in-flight requests. Zenoti enforces a per-account rate limit,
     * so a fan-out across every center has to be bounded rather than firing
     * one request per center at once. Defaults to 4.
     */
    concurrency?: number;
};

export class CentersService {
    constructor(private readonly zenoti: ZenotiClient) {}

    /**
     * List the centers (locations) on the account.
     *
     * The rest of the SDK is scoped to the single `centerId` passed to the
     * client, so this is the entry point for a multi-location business that
     * needs to discover its own centers.
     */
    async getAll(page: number = 1, size: number = 100): Promise<Center[]> {
        const response = await this.zenoti
            .getClient()
            .get("/v1/centers", { params: { page, size } });

        const data = (await response.data) as ListCentersResponse;
        return data.centers ?? [];
    }

    /**
     * Search appointment availability across several centers at once.
     *
     * Zenoti has no cross-center availability endpoint: slots are reachable
     * only by creating a booking against one center and reading its slots. A
     * naive implementation therefore fires one booking-plus-slots pair per
     * center simultaneously, which is the quickest way to hit the account
     * rate limit on a business with a dozen or more locations.
     *
     * This runs the fan-out through a bounded worker pool and isolates
     * failures per center, so one unreachable or rate-limited center degrades
     * that row instead of failing the whole search.
     */
    async searchAvailability(
        options: SearchAvailabilityOptions
    ): Promise<CenterAvailability[]> {
        const {
            serviceId,
            date,
            guestId,
            therapistId,
            concurrency = 4
        } = options;

        const centerIds =
            options.centerIds ?? (await this.getAll()).map(center => center.id);

        if (centerIds.length === 0) return [];

        const results: CenterAvailability[] = new Array(centerIds.length);
        let cursor = 0;

        const worker = async (): Promise<void> => {
            for (;;) {
                const index = cursor;
                cursor += 1;
                if (index >= centerIds.length) return;

                const centerId = centerIds[index];

                try {
                    results[index] = {
                        center_id: centerId,
                        slots: await this.slotsForCenter(
                            centerId,
                            serviceId,
                            date,
                            guestId,
                            therapistId
                        )
                    };
                } catch (error) {
                    // One center's failure must not blank the other locations.
                    results[index] = {
                        center_id: centerId,
                        slots: [],
                        error: {
                            name:
                                error instanceof ZenotiError
                                    ? error.name
                                    : "ZenotiError",
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "Availability lookup failed"
                        }
                    };
                }
            }
        };

        await Promise.all(
            Array.from({ length: Math.min(concurrency, centerIds.length) }, worker)
        );

        return results;
    }

    /**
     * Create a throwaway booking against one center and read its slots.
     *
     * Zenoti models availability this way: a booking has to exist before its
     * open times can be read. The booking is not reserved or confirmed here,
     * so it holds nothing.
     */
    private async slotsForCenter(
        centerId: string,
        serviceId: string,
        date: string,
        guestId: string,
        therapistId?: string
    ) {
        const payload = {
            center_id: centerId,
            date,
            is_only_catalog_employees: true,
            guests: [
                {
                    id: guestId,
                    items: [
                        {
                            item: { id: serviceId },
                            ...(therapistId
                                ? { therapist: { Id: therapistId } }
                                : undefined)
                        }
                    ]
                }
            ]
        };

        const booking = await this.zenoti
            .getClient()
            .post("/v1/bookings?is_double_booking_enabled=false", payload);

        const bookingId = booking.data?.id;
        if (!bookingId) return [];

        const slots = await this.zenoti
            .getClient()
            .get(`/v1/bookings/${bookingId}/slots`);

        return slots.data?.slots ?? [];
    }
}
