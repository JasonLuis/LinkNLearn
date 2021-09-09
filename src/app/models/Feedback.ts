import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Course } from "./Course";
import { Student } from "./Student";

@Entity('feedback')
export class Feedback {

    @Column()
    description: string;

    @Column()
    classification: number;

    @ManyToOne(type => Course, feedback => Feedback, {primary : true})
    @JoinColumn({name: 'id_course'})
    course: Course;

    @ManyToOne(type => Student, feedback => Feedback, {primary : true})
    @JoinColumn({name: 'id_student'})
    student: Student;
}

