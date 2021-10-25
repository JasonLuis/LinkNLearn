import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Cart } from "../../models/Cart";
import { Purchase } from "../../models/Purchase";



export const listCart = async (request: Request, response: Response) => {

    const repoPurchase = await getRepository(Purchase);

    const id = request.userId;

    const cartExist = await repoPurchase.findOne({
        status: 'open',
        student: id as any,
    }, { relations: ["cart"]});

    console.log(cartExist);
    if(!cartExist){
        return response.status(409).json({
            "message": "not found"
        })
    }

    return response.sendStatus(201);
}

export const createCart = async (request: Request, response: Response) => {
    
    const repoPurchase = await getRepository(Purchase);
    const repoCart = await getRepository(Cart);

    
}