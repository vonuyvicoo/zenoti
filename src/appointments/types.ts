import { Guest } from "@/guests";
import { Price, Service } from "@/services/types";
import { Therapist } from "@/therapists/types";

export type Appointment = {
    appointment_id: string;
    appointment_segment_id: string;
    parent_service_name: string;
    appointment_group_id: string;
    invoice_id: string; 
    start_time: string;
    start_time_utc: string;
    end_time: string;
    end_time_utc: string;
    service: Service;
    status: number;
    source: number;
    progress: number;
    locked: boolean;
    guest: Guest;
    therapist: Therapist;
    price: Price;
    actual_start_time: string | null,
    actual_completed_time: string | null,
    checkin_time: string | null,
    therapist_name: string | null
}

export type ListAppointmentResponse = Appointment[];
