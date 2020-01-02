import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, UpdateDateColumn } from "typeorm";
import { User } from "src/user/user.entity";

@Entity()
export class Idea {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    update: Date;

    @Column('text')
    idea: string;

    @Column('text')
    description: string;

    @ManyToOne(type => User, author => author.ideas)
    author: User;
}
