import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Plan } from "./Plan";

@Entity('teachers')
export class Teacher{
    @PrimaryGeneratedColumn('uuid')
    id_teacher: string;

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
    biography: string;

    @Column()
    linkedin: string;

    @Column()
    portifolio: string;

    @Column()
    contact: string;

    @Column()
    pix: string;

    @ManyToOne(type => Plan, teachers => Teacher)
    @JoinColumn({name: 'id_plan'})
    plan: Plan;
}