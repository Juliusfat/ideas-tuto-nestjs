import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';
import { Idea } from 'src/idea/idea.entity';
import { Comment } from 'src/comment/comment.entity'
import { CommentService } from 'src/comment/comment.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Idea, Comment])],
    controllers: [
        UserController, ],
    providers: [
        UserService, CommentService, UserResolver],
})
export class UserModule {}
