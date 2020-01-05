import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, UseGuards } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { UserDecorator } from 'src/user/user.decorator';

@Controller('api/ideas')
export class IdeaController {

    constructor(private ideaService: IdeaService) { }

    @Get()
    showAllIdeas() {
        return this.ideaService.showAll();
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes( new ValidationPipe())
    createIdea(@UserDecorator('id') userId, @Body() data: IdeaDTO) {
        return this.ideaService.create(userId, data);
    }

    @Get(':id')
    readId(@Param('id') id: number) {
        return this.ideaService.read(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes( new ValidationPipe())
    updateId(@Param('id') id: number, @UserDecorator('id') userId, @Body() data: Partial<IdeaDTO>) {
        return this.ideaService.update(id, userId, data);
     }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    removeId(@Param('id') id: number, @UserDecorator('id') userId) { 
        return this.ideaService.destroy(id, userId);
    }

    @Post(':id/upvote')
    @UseGuards(new AuthGuard())
    upvoteIdea(@Param('id') id: number, @UserDecorator('id') userId: number) {
      return this.ideaService.upvote(id, userId);
    }
  
    @Post(':id/downvote')
    @UseGuards(new AuthGuard())
    downvoteIdea(@Param('id') id: number, @UserDecorator('id') userId: number) {
      return this.ideaService.downvote(id, userId);
    }

    @Post(':id/bookmark')
    @UseGuards(new AuthGuard())
    bookmarkIdea(@Param('id') id: number, @UserDecorator('id') userId: number){
        return this.ideaService.bookmark(id, userId);
    }

    @Delete(':id/bookmark')
    @UseGuards(new AuthGuard())
    unbookmarkIdea(@Param('id') id: number, @UserDecorator('id') userId: number){
        return this.ideaService.unbookmark(id, userId);
    }
   
}
