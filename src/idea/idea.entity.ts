import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { User } from "src/user/user.entity";
import { Comment } from "src/comment/comment.entity";

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

    @ManyToMany( type => User, { cascade : true})
    @JoinTable()
    upvotes: User[]

    @ManyToMany( type => User, { cascade : true})
    @JoinTable()
    downvotes: User[]

    @OneToMany( type => Comment, comment => comment.idea, { cascade : true})
    comments :Comment[];
}
