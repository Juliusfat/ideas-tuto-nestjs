import { IsNotEmpty } from "class-validator";
import { Idea } from "src/idea/idea.entity";

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
    ideas?: Idea[];
    bookmarks?: Idea[];
}