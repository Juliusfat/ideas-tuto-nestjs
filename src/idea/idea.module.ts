import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './idea.entity';
import { User } from 'src/user/user.entity';
import { IdeaResolver } from './idea.resolver';
import { CommentService } from 'src/comment/comment.service';
import { Comment } from 'src/comment/comment.entity';

@Module({
    imports: [ TypeOrmModule.forFeature([Idea, User, Comment])],
    controllers: [
        IdeaController, ],
    providers: [
        IdeaService, CommentService, IdeaResolver ],
})
export class IdeaModule {}
