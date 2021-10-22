import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from "./Teacher";

@Entity('plans')
export class Plan{
    @PrimaryGeneratedColumn('uuid')
    id_plan: string;

    @Column()
    title: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @OneToMany(type => Teacher, plan => Plan)
    teacher: Teacher[];
}