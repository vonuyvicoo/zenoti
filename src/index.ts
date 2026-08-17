import { GuestService } from "./guests";
import { AppointmentService } from "./appointments";
import { ZenotiClient, ZenotiClientOptions } from "./_internal/client";
import { BookingService } from "./bookings/bookings.service";
import { ServicesService } from "./services/services.service";
import { TherapistService } from "./therapists/therapists.service";
import { CentersService } from "./centers/centers.service";
import { PaymentsService } from "./payments/payments.service";

class Zenoti extends ZenotiClient {
    public guests: GuestService;
    public appointments: AppointmentService;
    public bookings: BookingService;
    public services: ServicesService;
    public therapists: TherapistService;
    public centers: CentersService;
    public payments: PaymentsService;

    constructor(options: ZenotiClientOptions){
        super(options);
        this.guests = new GuestService(this);
        this.appointments = new AppointmentService(this);
        this.bookings = new BookingService(this);
        this.services = new ServicesService(this);
        this.therapists = new TherapistService(this);
        this.centers = new CentersService(this);
        this.payments = new PaymentsService(this);
    }
}

export {
    Zenoti,
    ZenotiClientOptions
}
export * from "./guests";
export * from "./appointments";
export * from "./therapists";
export * from "./services";
export * from "./errors";
export * from "./bookings";
export * from "./centers";
export * from "./payments";

