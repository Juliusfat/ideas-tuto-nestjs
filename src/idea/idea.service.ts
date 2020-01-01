import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Idea } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from './idea.dto';

@Injectable()
export class IdeaService {

    constructor(
        @InjectRepository(Idea)
        private ideaRepository: Repository<Idea>
        ) {}

    async showAll() {
        return await this.ideaRepository.find();
    }

    async create(data: IdeaDTO) {
        const idea = this.ideaRepository.create(data);
        await this.ideaRepository.save(idea);
        return idea;
    }

    async read(id: number) {
        const idea = await this.ideaRepository.findOne({ where : { id }});
        console.log(idea);
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return idea;
    }

    async update(id: number, data: Partial<IdeaDTO>) {
        const idea = await this.ideaRepository.findOne({ where : { id }});
        console.log(idea);
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        await this.ideaRepository.update({ id }, data);
        return await this.ideaRepository.findOne({ where : { id }});
    }

    async destroy(id: number) {
        const idea = await this.ideaRepository.findOne({ where : { id }});
        console.log(idea);
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        await this.ideaRepository.delete({ id });
        return idea;
    }
}
