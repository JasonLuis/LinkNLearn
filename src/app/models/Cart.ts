import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Course } from "./Course";
import { Purchase } from "./Purchase";

@Entity('cart')
export class Cart {
    
    @ManyToOne(type => Course, cart => Cart, {primary : true})
    @JoinColumn({name: 'id_course'})
    course: Course;

    @ManyToOne(type => Purchase, cart => Cart, {primary : true})
    @JoinColumn({name: 'id_purchase'})
    purchase: Purchase;
}