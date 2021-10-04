import { getRepository, Not } from "typeorm";
import { Student }  from "../../models/Student";
import { StudentsCourses } from "../../models/StudentsCourses";
import { Request, Response } from "express";
import { request } from "http";

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
        id_student: Not(id),
        email: email,
    });
    const cpfExists = await repository.findOne({
        id_student: Not(id),
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

export const buyCourses = async(request: Request, response: Response) => {
    const repository = await getRepository(StudentsCourses)
    const id  = request.userId;
    const { id_course } = request.body;
    const body = {
        student: id,
        course: id_course,
    };

    const buy = repository.create(body as any);
    const buyCourses = await repository.save(buy);

    return response.json(buyCourses);
}

export const getStudentById = async(request: Request, response: Response) => {
    const repository = await getRepository(Student);
    const id = request.userId;
    const student = await repository.find({where: {id_student: id}});

    return response.json(student);
}

export const listAllByCourses = async(request: Request, response: Response) => {
    const repository = await getRepository(StudentsCourses)
    const id  = request.userId;
    const courses = await repository.find({where: {student:  id}, relations: ["course"]});

    return response.json(courses);
}

