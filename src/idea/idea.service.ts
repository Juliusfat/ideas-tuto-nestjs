import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Idea } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class IdeaService {

    constructor(
        @InjectRepository(Idea)
        private ideaRepository: Repository<Idea>,
        @InjectRepository(User)
        private userRepository: Repository<User>
        ) {}

    private toResponseObject(idea: Idea) {
        return { ... idea, author: idea.author.toResponseObject()}
    }

    private ensureOwnership(idea: Idea, userId: number) {
        console.log(userId);
        console.log(idea.author.id);
        if( idea.author.id !== userId) {
            throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
        }
    }

    async showAll(): Promise<IdeaRO[]> {
        const ideas = await this.ideaRepository.find({ relations: ['author']});
        return ideas.map( idea => this.toResponseObject(idea));
    }

    async create(userId: number, data: IdeaDTO): Promise<IdeaRO> {
        const user = await this.userRepository.findOne({ where : { userId}})
        const idea = this.ideaRepository.create({ ... data, author: user });
        await this.ideaRepository.save(idea);
        return this.toResponseObject(idea);
    }

    async read(id: number) : Promise<IdeaRO>{
        const idea = await this.ideaRepository.findOne({ where : { id } , relations : ['author']});
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return this.toResponseObject(idea);
    }

    async update(id: number, userId: number, data: Partial<IdeaDTO>) : Promise<IdeaRO>{
        let idea = await this.ideaRepository.findOne({ where : { id }, relations: ['author']});
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.update({ id }, data);
        idea = await this.ideaRepository.findOne({ where : { id }, relations: ['author']});
        return this.toResponseObject(idea);
    }

    async destroy(id: number, userId: number ) : Promise<IdeaRO> {
        const idea = await this.ideaRepository.findOne({ where : { id }, relations: ['author']});
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.delete({ id });
        return this.toResponseObject(idea);
    }
}
