import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from "./Teacher";

@Entity('courses')
export class Course {

    @PrimaryGeneratedColumn('uuid')
    id_course: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    level: string;

    @Column()
    startDate: Date;

    @Column()
    finishDate: Date;

    @Column()
    period: string;

    @Column()
    classDate: string;

    @Column()
    maxStudent: number;

    @Column()
    price: number;

    @Column()
    platform: string;

    @Column()
    logoCourse: string;

    @Column()
    hours: string;

    @ManyToOne(type => Teacher, course => Course)
    @JoinColumn({name: 'id_teacher'})
    teacher: Teacher;
}