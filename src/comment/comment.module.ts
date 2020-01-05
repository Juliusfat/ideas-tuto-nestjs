import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from 'src/idea/idea.entity';
import { User } from 'src/user/user.entity';
import { Comment } from './comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Idea, User, Comment])],
    controllers: [
        CommentController, ],
    providers: [
        CommentService, ],
})
export class CommentModule {}
