import { getRepository, Not } from "typeorm";
import { Student }  from "../../models/Student";
import { Request, Response } from "express";

//função so para teste
export const listStudents = async(request: Request, response: Response) => {
    const students = await getRepository(Student).find();
    return response.json(students);
}

export const saveUserStudent = async(request: Request, response: Response) => {
    const repository = await getRepository(Student)
    const { cpf, email } = request.body;

    const emailExists = await repository.findOne({ where: {email} });
    const cpfExists =  await repository.findOne({ where: {cpf} });

    if(emailExists || cpfExists){
        return response.sendStatus(409);
    }
    
    const student = repository.create(request.body)
    const userStudent = await repository.save(student);

    return response.json(userStudent);
}

export const updateStudent = async(request: Request, response: Response) => {
    const repository = await getRepository(Student)
    const id  = request.userId;
    const { cpf, email } = request.body;
    
    const emailExists = await repository.findOne({
        id_students: Not(id),
        email: email,
    });
    const cpfExists = await repository.findOne({
        id_students: Not(id),
        cpf: cpf,
    });
    
    //console.log(emailExists);
    if(emailExists || cpfExists){
        return response.sendStatus(409).json({
            message: "CPF or email used by another user"
        });
    }

    const student = repository.create(request.body);
    
    const user = await repository.update(id, student as any);

    if(user.affected === 1){
        
        const userUpdate = await repository.findOne(id);
        return response.json(userUpdate);
    }

    return response.status(404).json({
        message: "User not found",
    });
}