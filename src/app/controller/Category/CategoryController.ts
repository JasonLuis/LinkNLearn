import { getRepository, Not } from "typeorm";
import { Category } from "../../models/Category";
import { Request, response, Response } from "express";
import { request } from "http";

export const listCategories = async(req: Request, res:Response) => {
    const category = await getRepository(Category).find();
    res.json(category);
}

export const saveCategory = async (request: Request, response: Response) => {
    const repository = await getRepository(Category);
  
    const saveCategory = repository.create(request.body);
    const category = await repository.save(saveCategory);
  
    return response.json(category);
};
