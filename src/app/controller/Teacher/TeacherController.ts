import { createQueryBuilder, getRepository, Not } from "typeorm";
import { Teacher } from "../../models/Teacher";
import { Course } from "../../models/Course";
import { Request, Response } from "express";
import { Plan } from "../../models/Plan";

export const listTeachers = async (request: Request, response: Response) => {
    const teacher = await getRepository(Teacher).find({ relations: ["plan"] });

    return response.json(teacher);
}

export const getTeacherById = async (request: Request, response: Response) => {
    const repository = await getRepository(Teacher);
    const id = request.body.id_teacher;
    const teacher = await repository.find({ where: { id_teacher: id } });

    return response.json(teacher);
}

export const getTeacherCourses = async (request: Request, response: Response) => {
    const repository = await getRepository(Course);
    const { teacher } = request.body;
    const courses = await repository.find({ where: { teacher: teacher } });

    return response.json(courses);
}

export const saveTeacher = async (request: Request, response: Response) => {
    const repository = await getRepository(Teacher)
    const { cpf, email } = request.body;

    const emailExists = await repository.findOne({ where: { email } });
    const cpfExists = await repository.findOne({ where: { cpf } });

    if (emailExists || cpfExists) {
        return response.sendStatus(409);
    }

    const teacher = repository.create(request.body)
    const userteacher = await repository.save(teacher);

    return response.json(userteacher);
}

export const updateTeacher = async (req: Request, res: Response) => {
    const repository = await getRepository(Teacher);
    const id = req.userId;
    const { cpf, email } = req.body;

    const emailExists = await repository.findOne({
        id_teacher: Not(id),
        email: email,
    });
    const cpfExists = await repository.findOne({
        id_teacher: Not(id),
        cpf: cpf,
    });

    if (emailExists || cpfExists) {
        return res.sendStatus(409).json({
            message: "CPF or email used by another user"
        });
    }

    const teacher = repository.create(req.body);

    const user = await repository.update(id, teacher as any);

    if (user.affected === 1) {

        const userUpdate = await repository.findOne(id);
        return res.json(userUpdate);
    }

    return res.status(404).json({
        message: "User not found",
    });
}


