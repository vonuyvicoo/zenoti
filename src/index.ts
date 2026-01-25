import { GuestService } from "./guests";
import { AppointmentService } from "./appointments";
import { ZenotiClient, ZenotiClientOptions } from "./_internal/client";

class Zenoti extends ZenotiClient {
    public guests: GuestService;
    public appointments: AppointmentService;

    constructor(options: ZenotiClientOptions){
        super(options);
        this.guests = new GuestService(this);
        this.appointments = new AppointmentService(this);
    }
}

export {
    Zenoti,
    ZenotiClientOptions
}
export * from "./guests";
export * from "./appointments";
