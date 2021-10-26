import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";
import { Category } from "./Category";
import { Feedback } from "./Feedback";
import { StudentsCourses } from "./StudentsCourses";
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

    @Column({
        default: 0
    })
    minStudent: number;

    @Column()
    price: number;

    @Column()
    platform: string;

    @Column({
        nullable: true
    })
    link: string;

    @Column()
    logoCourse: string;

    @Column()
    hours: string;

    @Column({
        default: 'open'
    })
    status: string;

    @ManyToOne(type => Teacher, course => Course)
    @JoinColumn({name: 'id_teacher'})
    teacher: Teacher;

    @OneToMany(type => StudentsCourses, course => Course)
    studentsCourses: StudentsCourses[];

    @OneToMany(type => Feedback, course => Course)
    feedback: Feedback[];

    @ManyToOne(type => Category, course => Course)
    @JoinColumn({name: 'id_category'})
    category: Category;

    @OneToMany(type => Cart, cart => cart.course)
    cart: Cart[];
}