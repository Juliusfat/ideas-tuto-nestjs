import { IsString } from 'class-validator'
import { UserRO } from 'src/user/user.dto';

export class IdeaDTO {
    
    @IsString()
    idea: string;

    @IsString()
    description: string;
}

export class IdeaRO {
    id?: number;
    idea: string;
    description: string;
    created: Date;
    update: Date;
    author: UserRO;
}