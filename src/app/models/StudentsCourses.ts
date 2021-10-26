import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Course } from "./Course";
import { Student } from "./Student";

@Entity('students_courses')
export class StudentsCourses {
    
    @Column({
        default: false
    })
    status: boolean;

    @Column({
        default: new Date()
    })
    purchaseDate: Date;

    @ManyToOne(type => Course, studentsCourses => StudentsCourses, {primary : true})
    @JoinColumn({name: 'id_course'})
    course: Course;

    @ManyToOne(type => Student, studentsCourses => StudentsCourses, {primary : true})
    @JoinColumn({name: 'id_student'})
    student: Student;
}