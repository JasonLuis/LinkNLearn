import { getRepository, Not } from "typeorm";
import { Plan } from "../../models/Plan";
import { Request, response, Response } from "express";
import { request } from "http";

export const listPlans = async(req: Request, res:Response) => {
    const plans = await getRepository(Plan).find();
    res.json(plans);
}

export const savePlans = async(req: Request, res:Response) => {
    const repository = await getRepository(Plan);
    
    const {title, description, price} = req.body || undefined;

    if(title === undefined || description === undefined || price === undefined) {
        return res.sendStatus(409);
    }
    
    const plan = repository.create(req.body);
    const create = await repository.save(plan);

    return res.json(create);
}

export const updatePlan = async(req: Request, res:Response) => {
    const repository = await getRepository(Plan);
    const {id_plan,title, description, price} = req.body || undefined;

    if(id_plan === undefined || title === undefined ||
        description === undefined || price === undefined) {
        return res.sendStatus(409);
    }

    const body = repository.create(req.body);
    const updatePlan = await repository.update(id_plan, body as any);

    if(updatePlan.affected === 1){
        const plan = await repository.findOne(id_plan);
        return res.json(plan);
    }

    return res.status(404).json({
        message: "User not found",
    });
}

//função que não sera utilizada
export const deletePlan = async(request: Request, response: Response) => {
    const { id_plan } = request.body;
    const plan = await getRepository(Plan).delete(id_plan);

    if(plan.affected === 1){
        //const planDeleted = await getRepository(Plan).findOne(id_plan)
        return response.json({message: 'Plan removed'});
    }

    return response.status(404).json({message: 'Plan not found'});
};