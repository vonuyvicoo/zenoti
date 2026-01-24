export type PersonalInfo = {
    first_name: string;
    last_name: string;
    middle_name: string;
    preferred_name: string;
    email: string;
}

export type Guest = {
    id: string;
    center_name: string;
    personal_info: PersonalInfo 
}

export type SearchGuestResponse = {
    guests: Guest[]
}
