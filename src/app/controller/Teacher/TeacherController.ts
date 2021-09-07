import { createQueryBuilder, getRepository, Not } from "typeorm";
import { Teacher }  from "../../models/Teacher";
import { Request, Response } from "express";
import { Plan } from "../../models/Plan";

export const listTeachers = async(request: Request, response: Response) => {
    const teacher = await getRepository(Teacher).find({relations: ["plan"]});
    
    return response.json(teacher);
}

export const saveTeacher = async(request: Request, response: Response) => {
    const repository = await getRepository(Teacher)
    const { cpf, email } = request.body;
    console.log(request.body);
    const emailExists = await repository.findOne({ where: {email} });
    const cpfExists =  await repository.findOne({ where: {cpf} });

    if(emailExists || cpfExists){
        return response.sendStatus(409);
    }
    
    const teacher = repository.create(request.body)
    const userteacher = await repository.save(teacher);

    return response.json(userteacher);
}