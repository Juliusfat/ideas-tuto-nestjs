import { Controller, Post, Get, Body, UsePipes, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { UserDecorator } from './user.decorator';

@Controller()
export class UserController {
    constructor(private userService: UserService) {

    }

    @Get('api/users')
    showAllUsers(@Query('page') page: number, @Query('take') take: number ) {
        return this.userService.showAll(page, take);
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: UserDto) {
        return this.userService.login(data);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() data: UserDto) {
        return this.userService.register(data);
    }
}
