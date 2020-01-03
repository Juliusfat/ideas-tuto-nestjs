import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Idea } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { User } from 'src/user/user.entity';
import { Votes } from 'src/shared/votes.enum';

@Injectable()
export class IdeaService {

    constructor(
        @InjectRepository(Idea)
        private ideaRepository: Repository<Idea>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    private toResponseObject(idea: Idea): IdeaRO {
        const responseObject: any = { ...idea, author: idea.author.toResponseObject() }
        if (idea.upvotes) {
            responseObject.upvotes = idea.upvotes.length;
        }
        if (idea.downvotes) {
            responseObject.downvotes = idea.downvotes.length;
        }
        return responseObject;
    }

    private ensureOwnership(idea: Idea, userId: number) {
        if (idea.author.id !== userId) {
            throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
        }
    }

    private async vote(idea: Idea, user: User, vote: Votes) {
        const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
        if (
            idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
            idea[vote].filter(voter => voter.id === user.id).length > 0
        ) {
            idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
            idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
            await this.ideaRepository.save(idea);
        } else if (idea[vote].filter(voter => voter.id === user.id).length < 1) {
            idea[vote].push(user);
            await this.ideaRepository.save(idea);
        } else {
            throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
        }

        return idea;
    }

    async showAll(): Promise<IdeaRO[]> {
        const ideas = await this.ideaRepository.find({ relations: ['author', 'upvotes', 'downvotes'] });
        return ideas.map(idea => this.toResponseObject(idea));
    }

    async create(userId: number, data: IdeaDTO): Promise<IdeaRO> {
        const user = await this.userRepository.findOne({ where: { userId } })
        const idea = this.ideaRepository.create({ ...data, author: user });
        await this.ideaRepository.save(idea);
        return this.toResponseObject(idea);
    }

    async read(id: number): Promise<IdeaRO> {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author','upvotes','downvotes'] });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return this.toResponseObject(idea);
    }

    async update(id: number, userId: number, data: Partial<IdeaDTO>): Promise<IdeaRO> {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.update({ id }, data);
        idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        return this.toResponseObject(idea);
    }

    async destroy(id: number, userId: number): Promise<IdeaRO> {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.delete({ id });
        return this.toResponseObject(idea);
    }

    async upvote(id: number, userId: number) {
        let idea = await this.ideaRepository.findOne({
            where: { id },
            relations: ['author', 'upvotes', 'downvotes'],
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        idea = await this.vote(idea, user, Votes.UP);

        return this.toResponseObject(idea);
    }

    async downvote(id: number, userId: number) {
        let idea = await this.ideaRepository.findOne({
            where: { id },
            relations: ['author', 'upvotes', 'downvotes'],
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        idea = await this.vote(idea, user, Votes.DOWN);

        return this.toResponseObject(idea);
    }


    async bookmark(id: number, userId: number) {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['bookmarks'],
        });

        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
            user.bookmarks.push(idea);
            console.log(idea);
            await this.userRepository.save(user);
        } else {
            throw new HttpException(
                'Idea already bookmarked ',
                HttpStatus.BAD_REQUEST,
            );
        }

        return user.toResponseObject(false);
    }

    async unbookmark(id: number, userId: number) {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['bookmarks'],
        });

        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0) {
            user.bookmarks = user.bookmarks.filter(
                bookmark => bookmark.id !== idea.id,
            );
            await this.userRepository.save(user);
        } else {
            throw new HttpException('Cannot remove bookmark', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(false);
    }
}
