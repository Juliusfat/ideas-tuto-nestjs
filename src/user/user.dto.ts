import { IsNotEmpty } from "class-validator";

export class UserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}

export interface UserRO {
    id:number;
    username: string;
    created: Date;
    token?: string;
}