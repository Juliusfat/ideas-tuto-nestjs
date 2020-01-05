import { Controller, Get, Param, Post, UseGuards, UsePipes, Body, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { Comment } from './comment.entity';
import { UserDecorator } from 'src/user/user.decorator';

@Controller('api/comments')
export class CommentController {

    constructor( private commentService: CommentService ) {}

    @Get('idea/:id')
    showCommentsByIdea(@Param('id') ideaId: number) {
        return this.commentService.showByIdea(ideaId);
    }

    @Get('user/:id')
    showCommentsByUser(@Param('id') userId: number) {
        return this.commentService.showByUser(userId);
    }

    @Post('idea/:id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createComment(@Param('id') ideaId: number, @UserDecorator('id') userId: number, @Body() data: Comment ) {
        return this.commentService.create(ideaId, userId, data);
    }

    @Get(':id')
    showComment(@Param('id') id: number) {
        return this.commentService.show(id);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    destroyComment(@Param('id') id: number, @UserDecorator('id') userId: number ) {
        return this.commentService.destroy(id, userId);
    }

}
