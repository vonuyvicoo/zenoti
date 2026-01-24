import { Type } from "class-transformer";
import { IsNumber, IsString, ValidateNested } from "class-validator";


export class MobilePhoneDto {
    @IsNumber()
    country_code!: number;
    @IsString()
    number!: string;
}

export class PersonalInfoDto {
    @IsString()
    first_name!: string;
    @IsString()
    last_name!: string;
    @ValidateNested()
    @Type(() => MobilePhoneDto)
    mobile_phone!: MobilePhoneDto;
    @IsString()
    email!: string;
}

export class CreateGuestDto {
    @ValidateNested()
    @Type(() => PersonalInfoDto)
    personal_info!: PersonalInfoDto;
}

