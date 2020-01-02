import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, UseGuards } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';

@Controller('api/ideas')
export class IdeaController {

    constructor(private ideaSevice: IdeaService) { }

    @Get()
    @UseGuards(new AuthGuard())
    showAllIdeas() {
        return this.ideaSevice.showAll();
    }

    @Post()
    @UsePipes( new ValidationPipe())
    createIdea(@Body() data: IdeaDTO) {
        return this.ideaSevice.create(data);
    }

    @Get(':id')
    readId(@Param('id') id: number) {
        return this.ideaSevice.read(id);
    }

    @Put(':id')
    @UsePipes( new ValidationPipe())
    updateId(@Param('id') id: number, @Body() data: Partial<IdeaDTO>) {
        return this.ideaSevice.update(id, data);
     }

    @Delete(':id')
    removeId(@Param('id') id: number) { 
        return this.ideaSevice.destroy(id);
    }

}
