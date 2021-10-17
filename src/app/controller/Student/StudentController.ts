import { getRepository, Not } from "typeorm";
import { Student } from "../../models/Student";
import { StudentsCourses } from "../../models/StudentsCourses";
import { Request, Response } from "express";
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcryptjs';
import * as crypto from "crypto";

//função so para teste
export const listStudents = async (request: Request, response: Response) => {
    const students = await getRepository(Student).find();
    return response.json(students);
}


export const saveUserStudent = async (request: Request, response: Response) => {
    const repository = await getRepository(Student)
    const { cpf, email } = request.body;

    const emailExists = await repository.findOne({ where: { email } });
    const cpfExists = await repository.findOne({ where: { cpf } });

    if (emailExists || cpfExists) {
        return response.sendStatus(409);
    }

    const student = repository.create(request.body)
    const userStudent = await repository.save(student);

    return response.json(userStudent);
}

export const updateStudent = async (request: Request, response: Response) => {
    const repository = await getRepository(Student)
    const id = request.userId;
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
    if (emailExists || cpfExists) {
        return response.sendStatus(409).json({
            message: "CPF or email used by another user"
        });
    }

    const student = repository.create(request.body);

    const user = await repository.update(id, student as any);

    if (user.affected === 1) {

        const userUpdate = await repository.findOne(id);
        return response.json(userUpdate);
    }

    return response.status(404).json({
        message: "User not found",
    });
}

export const forgotPassword = async (request: Request, response: Response) => {
    const { email } = request.body;

    try {

        const user = await getRepository(Student).find({
            where: {
                email
            }
        })


        if (user.length === 0) {
            return response.status(404).json({
                message: "User not found"
            });
        }

        const transporter = nodemailer.createTransport({
            // -> conf mailtrap
            /*host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "6eb9921a9fd7a4",
                pass: "21bae478f32eac"
            }*/
            // -> conf gmail
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: "linklearninc@gmail.com",
                pass: "Linklearn123"
            }
        })

        const newPassword = crypto.randomBytes(4).toString('HEX')

        transporter.sendMail({
            from: 'Administrador <457f7a1349-e88ec1@inbox.mailtrap.io>',
            to: email,
            subject: 'Recuperação de Senha',
            html: `<p>Olá, sua nova senha para acessar o sistema é: ${newPassword}</p><br><a href="http://localhost:3000/">Sistema</a>`,
        }).then(
            () => {
                bcrypt.hash(newPassword, 8).then(
                    password => {
                        getRepository(Student).update(user[0].id_student, {
                            password
                        }).then(
                            () => {
                                return response.status(200).json({ message: 'Email sended' });
                            }
                        ).catch(
                            () => {
                                return response.status(404).json({ message: 'User not found' });
                            }
                        )
                    }
                )
            }
        )

    } catch (error) {
        return response.status(422).json({ message: 'Fail to send email' });
    }
}

export const buyCourses = async (request: Request, response: Response) => {
    const repository = await getRepository(StudentsCourses)
    const id = request.userId;
    const { id_course } = request.body;
    const body = {
        student: id,
        course: id_course,
    };

    const buy = repository.create(body as any);
    const buyCourses = await repository.save(buy);

    return response.json(buyCourses);
}

export const getStudentById = async (request: Request, response: Response) => {
    const repository = await getRepository(Student);
    const id = request.userId;
    const student = await repository.find({ where: { id_student: id } });

    return response.json(student);
}

export const listAllByCourses = async (request: Request, response: Response) => {
    const repository = await getRepository(StudentsCourses)
    const id = request.userId;
    const courses = await repository.find({ where: { student: id }, relations: ["course", "course.teacher"] });

    return response.json(courses);
}

