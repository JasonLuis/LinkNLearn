import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { StudentsCourses } from "./StudentsCourses";
import { Feedback } from "./Feedback";
import { Purchase } from "./Purchase";

@Entity('students')
export class Student {

    @PrimaryGeneratedColumn('uuid')
    id_student: string;

    @Column()
    name: string;

    @Column()
    last_name: string;

    @Column()
    cpf: string;

    @Column()
    birthDate: Date;

    @Column()
    gender: string;

    @Column()
    email: string;

    @Column({
        default: 0
    })
    credit: number

    @Column()
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    @Column()
    pictureProfile: string;

    @Column()
    educationLevel: string;

    @OneToMany(type => StudentsCourses, student => Student)
    studentsCourses: StudentsCourses[];

    @OneToMany(type => Feedback, feedback => feedback.student)
    feedback: Feedback[];

    @OneToMany(type => Purchase, purchase => purchase.student)
    purchase: Purchase[];

}