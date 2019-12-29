import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './idea.entity';

@Module({
    imports: [ TypeOrmModule.forFeature([Idea])],
    controllers: [
        IdeaController, ],
    providers: [
        IdeaService, ],
})
export class IdeaModule {}
