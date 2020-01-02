import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, UseGuards } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('api/ideas')
export class IdeaController {

    constructor(private ideaSevice: IdeaService) { }

    @Get()
    showAllIdeas() {
        return this.ideaSevice.showAll();
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes( new ValidationPipe())
    createIdea(@User('id') userId, @Body() data: IdeaDTO) {
        return this.ideaSevice.create(userId, data);
    }

    @Get(':id')
    readId(@Param('id') id: number) {
        return this.ideaSevice.read(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes( new ValidationPipe())
    updateId(@Param('id') id: number, @User('id') userId, @Body() data: Partial<IdeaDTO>) {
        return this.ideaSevice.update(id, userId, data);
     }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    removeId(@Param('id') id: number, @User('id') userId) { 
        return this.ideaSevice.destroy(id, userId);
    }

}
