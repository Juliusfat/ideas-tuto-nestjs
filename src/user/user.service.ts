import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto, UserRO } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ){}

    async showAll(): Promise<UserRO[]> {
        const users = await this.userRepository.find({ relations: ['ideas','bookmarks']});
        return users.map(user => user.toResponseObject(false));
    }

    async login(data: UserDto): Promise<UserRO> {
        const { username, password } = data;
        const user = await this.userRepository.findOne({ where : {username} });
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException('Invalid username/password', HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject();
    }
    
    async register(data: UserDto): Promise<UserRO> {
        const {username} = data;
        let user = await this.userRepository.findOne({ where : {username} });
        if (user) {
            throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
        }
        user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return user.toResponseObject();
    }
}
