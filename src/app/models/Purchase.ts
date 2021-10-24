import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";
import { Student } from "./Student";

@Entity('purchase')
export class Purchase {

    @PrimaryGeneratedColumn('uuid')
    id_purchase: string;

    @Column({ type: "numeric", default: 0})
    totalPrice: number;

    @Column({
        default: "open"
    })
    status: string;

    @Column()
    typePayment: string;


    @Column({
        default: new Date()
    })
    dateBuy: Date;

    @ManyToOne(type => Student, student => Student)
    @JoinColumn({name: 'id_student'})
    student: Student;

    @OneToMany(type => Cart, cart => cart.purchase)
    cart: Cart[];
}