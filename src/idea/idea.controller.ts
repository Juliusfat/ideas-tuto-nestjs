import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';

@Controller('idea')
export class IdeaController {

    constructor(private ideaSevice: IdeaService) { }

    @Get()
    showAllIdeas() {
        return this.ideaSevice.showAll();
    }

    @Post()
    createIdea(@Body() data: IdeaDTO) {
        return this.ideaSevice.create(data);
    }

    @Get(':id')
    readId(@Param('id') id: number) {
        return this.ideaSevice.read(id);
    }

    @Put(':id')
    updateId(@Param('id') id: number, @Body() data: Partial<IdeaDTO>) {
        return this.ideaSevice.update(id, data);
     }

    @Delete(':id')
    removeId(@Param('id') id: number) { 
        return this.ideaSevice.destroy(id);
    }

}
