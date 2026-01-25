import { PersonalInfo } from "@/guests";

export type Therapist = {
    id: string;
    first_name: string; 
    last_name: string; 
    nick_name: string | null;
    display_name: string | null;
    email: string; 
    gender: 0;
    vanity_image_url: string;
}

export type TherapistBase = {
    id: string;
    code: string;
    personal_info: PersonalInfo;
    job_info: any;
    catalog_info: any;
}

export type ListTherapistsResponse = TherapistBase[];
