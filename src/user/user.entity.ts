import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, Unique, OneToMany } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';
import { UserRO } from "./user.dto";
import { Idea } from "src/idea/idea.entity";

@Entity()
@Unique(['username'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created: Date;

    @Column()
    username: string

    @Column()
    password: string

    @OneToMany(type => Idea, idea => idea.author)
    ideas: Idea[];


    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    toResponseObject (showToken: boolean = true) {
        const userRO: UserRO = {
            id : this.id,
            username: this.username,
            created: this.created
        };
        if (showToken) {
            userRO.token = this.token 
        }

        if(this.ideas) {
            userRO.ideas = this.ideas;
        }
        return userRO;
    }

    async comparePassword (attempt: string) {
        return await bcrypt.compare(attempt, this.password);
    }

    private get token() {
        const { id, username } = this;
        return jwt.sign(
            { id, username },
            process.env.SECRET,
            { expiresIn : '7d'}
        );
    } 
}