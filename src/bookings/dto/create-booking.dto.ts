import { Type } from "class-transformer";
import { IsDateString, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class ServiceDto {
    @IsUUID()
    item_id!: string;
}
export class GuestDto {
    @IsUUID()
    id!: string;
    @ValidateNested()
    @Type(() => ServiceDto) 
    items!: ServiceDto;
}

export class CreateBookingDto {
    @IsDateString()
    date!: string;
    @ValidateNested()
    @Type(() => GuestDto)   
    guests!: GuestDto;
    @IsString()
    @IsOptional()
    therapist_id?: string;
}

