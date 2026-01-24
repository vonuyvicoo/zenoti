import { Service } from "@/services/types";

export type Appointment = {
    start_time: string;
    end_time: string;
    service: Service;
}

export type ListAppointmentResponse = Appointment[];
