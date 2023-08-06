import { request, Request, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { Cart } from "../../models/Cart";
import { Course } from "../../models/Course";
import { Purchase } from "../../models/Purchase";
import { StudentsCourses } from "../../models/StudentsCourses";
import * as nodemailer from 'nodemailer';
import { Student } from "../../models/Student";

const transporter = nodemailer.createTransport({
    // -> conf gmail
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "",
        pass: ""
    },
    tls: {
        rejectUnauthorized: false
    }
}); 

export const listCart = async (request: Request, response: Response) => {
  const id = request.userId;
  const arrCourses = [];
  
  const repoPurchase = await createQueryBuilder(Course)
    .innerJoinAndSelect(
      "teachers",
      "t",
      "t.id_teacher = Course.id_teacher"
    )
    .innerJoinAndSelect(
      "cart",
      "c",
      "c.id_course = Course.id_course",
    )
    .innerJoinAndSelect(
        "purchase",
        "p",
        "p.id_purchase = c.id_purchase"
    )
    .select(`
     c.id_course as id_course,
     p.*
    `)
    .where(
        "p.status = :status and p.id_student = :id_student",
        {status: "open", id_student: id},
    )
    .getRawMany();

  repoPurchase.map((item)=> {
    arrCourses.push(item.id_course);
  })

  const arr = [];
  const repository = getRepository(Course);
  for (const item of arrCourses) {
    const course = await repository.findOne({ where: { id_course: item }, relations: ["teacher"]});
    arr.push(course);
  }

  const body = {
    purchases: repoPurchase,
    courses: arr
  }
  
  if (repoPurchase === undefined || arrCourses.length === 0) {
    return response.status(409).json({
      message: "not found",
    });
  }

  return response.status(201).json(body);
};

export const createCart = async (request: Request, response: Response) => {
  const repoPurchase = getRepository(Purchase);
  const repoCart = getRepository(Cart);

  const id = request.userId;

  const purchase = await repoPurchase.findOne({
    where: {
      status: "open",
      student: id as any,
    },
  });

  const body = {
    student: request.userId,
  };
  let id_purchase = undefined;

  if (purchase === undefined) {
    const create = repoPurchase.create(body as any);
    const save = await repoPurchase.save(create);
    const res = await repoPurchase.findOne({
      where: {
        status: "open",
        student: id as any,
      },
    });
    id_purchase = res.id_purchase;
  } else {
    id_purchase = purchase.id_purchase;
  }

  const { course } = request.body;

  const produtos = await createQueryBuilder(Course)
    .innerJoinAndSelect(
      "cart",
      "c",
      "c.id_course = Course.id_course"
    )
    .where(
        "c.id_course = :id_course and c.id_purchase = :id_purchase",
        {id_course: course, id_purchase: id_purchase},
    )
    .getRawMany();
    
    console.log(produtos)
    if(produtos.length !== 0) {
        return response.status(201).json(
            {
                message: "product is already in the cart"
            }
        );
    }
    
    if(id_purchase === undefined){
        return response.sendStatus(500).json({
            message: "internal server error"
        });
    }
    const bodyCart:Cart = {
        course: course,
        purchase: id_purchase
    }
    const create = await repoCart.create(bodyCart);
    const save = await repoCart.save(create);
  return response.status(201).json(save);
};

export const deleteItem = async (request: Request, response:Response) => {
  const repoPurchase = getRepository(Purchase);
  const repoCart = getRepository(Cart);
  const id = request.userId;
  const {id_purchase} = await repoPurchase.findOne({
    where: {
      status: "open",
      student: id as any,
    },
    relations: ["student"],
  });
  const { id_course } = request.body;

  if(id_purchase === undefined){
    return response.status(400).json({
      message: "empty cart",
    });
  }

  const course = await repoCart.delete({course: id_course, purchase: id_purchase as any});

  if(course.affected === 1){
    return response.status(200).json(course);
  }

  return response.status(401).json({
    message: "error deleting item"
  });
}


export const finishBuy = async (request: Request, response: Response) => {
    const repository = getRepository(Purchase);
    const repoStudent = getRepository(Student)
    const repoCourse = getRepository(Course);
    const repoStudentCourses = getRepository(StudentsCourses);
    const id = request.userId;
    const { purchase } = request.body;
    const { email,name } = await repoStudent.findOne({ where: { id_student: id } });
    //const purchase = repository.create(request.body);
    const listPurchase = await createQueryBuilder(Course)
    .innerJoinAndSelect(
      "cart",
      "c",
      "c.id_course = Course.id_course",
    )
    .innerJoinAndSelect(
        "purchase",
        "p",
        "p.id_purchase = c.id_purchase"
    )
    .select(`c.id_course as id_course`)
    .where(
        `p.id_purchase = :id_purchase and p.id_student = :id_student
         and p.status = 'open'`,
        {id_purchase: purchase, id_student: id},
    )
    .getRawMany();
    
    if(listPurchase.length === 0){
        return response.status(200).json({
            message: "purchase not found"
        });
    }

    
    
    listPurchase.map(async (item) => {
        const body = {
            student: id,
            course: item,
        };
        const {title, link} = await repoCourse.findOne({
             where: {id_course: item.id_course} });
        const students_courses = await repoStudentCourses.findOne({
            where: {course: item.id_course, student: id}
        })
        console.log(students_courses);
        if(students_courses !== undefined){
            return response.send(500).json(
                {
                    message: "internal server error"
                }
            )
        }
        const buy = repoStudentCourses.create(body as any);
        const buyCourses = await repoStudentCourses.save(buy);
        transporter.sendMail({
            from: 'LinkLearn <>',
            to: email,
            subject: `Bem Vindo ao curso de ${title}`,
            html: `<p>Olá ${name}, parabens por ter adquirido o curso de ${title}.</p><br>
            <p>
                Acesse o link para ter acesso a plataforma: <a href="#">${link}</a>
                e de um up no seu futuro.
            </p>`,
        });

    });

    const createPurchase = repository.create({status: 'finished',typePayment: 'credit'});
    const finishedBuy = await repository.update(purchase, createPurchase as any);

    if (finishedBuy.affected === 1) {
        const buy = await repository.findOne(id);
        return response.json(buy);
    }
    return response.status(500).json({
        message: 'error'
    });
}
