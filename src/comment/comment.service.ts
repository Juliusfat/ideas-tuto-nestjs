import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Idea } from 'src/idea/idea.entity';
import { CommentDTO } from './comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Idea)
        private ideaRepository: Repository<Idea>,
    ) { }

    private toResponseObject(comment: Comment) {
        const reponseObject:any = comment;
        if (comment.author) {
            reponseObject.author = comment.author.toResponseObject(false); 
        }
        return reponseObject;
    }

    async show(id: number) {
        const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] });
        return this.toResponseObject(comment);
    }

    async showByIdea(id: number) {
        const idea = await this.ideaRepository.findOne({
            where: { id },
            relations: ['comments', 'comments.author', 'comments.idea']
        });

        return idea.comments.map(comment => this.toResponseObject(comment));
    }

    async showByUser(id: number) {
        const comments = await this.commentRepository.find({
            where: { author: id },
            relations: ['author']
        });

        return comments.map(comment => this.toResponseObject(comment));
    }

    async create(ideaId: number, userId: number, data: CommentDTO) {
        const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        const comment = await this.commentRepository.create({
            ...data,
            author: user,
            idea
        });
        await this.commentRepository.save(comment);
        return this.toResponseObject(comment);
    }

    async destroy(id: number, userId: number) {
        const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] });

        if (comment.author.id !== userId) {
            throw new HttpException('You do not own this comment', HttpStatus.UNAUTHORIZED);
        }

        await this.commentRepository.remove(comment);
        return this.toResponseObject(comment);
    }
}
