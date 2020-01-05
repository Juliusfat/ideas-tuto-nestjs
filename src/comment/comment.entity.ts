import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne } from "typeorm";
import { User } from "src/user/user.entity";
import { Idea } from "src/idea/idea.entity";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created: Date;

    @Column()
    comment: string;

    @ManyToOne(type => User)
    author: User;

    @ManyToOne(type => Idea, idea => idea.comments)
    idea: Idea;
}