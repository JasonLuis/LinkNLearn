import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';

@Entity()
export class Students {

    @PrimaryGeneratedColumn('uuid')
    id_students: string;

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
    educationLevel: string;

}