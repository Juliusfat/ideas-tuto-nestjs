import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from "typeorm";

@Entity()
export class Idea {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created: Date;

    @Column('text')
    idea: string;

    @Column('text')
    description: string;
}
