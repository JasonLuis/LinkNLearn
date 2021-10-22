import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./Course";

@Entity('category')
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id_category: string;

    @Column()
    title: string;

    @OneToMany(type => Course, category => Category)
    course: Course[];
}