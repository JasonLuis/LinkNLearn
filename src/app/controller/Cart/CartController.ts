import { Request, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { Cart } from "../../models/Cart";
import { Course } from "../../models/Course";
import { Purchase } from "../../models/Purchase";

export const listCart = async (request: Request, response: Response) => {
  const repoPurchase = await getRepository(Purchase);

  const id = request.userId;

  const produtos = await createQueryBuilder(Course)
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
     p.id_purchase as id_purchase,
     Course.title as title,
     Course.price as price,
     Course.description as description
     `)
    .where(
        "p.status = :status and p.id_student = :id_student",
        {status: "open", id_student: id},
    )
    .getRawMany();

  if (produtos === undefined) {
    return response.status(409).json({
      message: "not found",
    });
  }

  return response.status(201).json(produtos);
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
