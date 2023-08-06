import { createQueryBuilder, getRepository, Not } from "typeorm";
import { Student } from "../../models/Student";
import { StudentsCourses } from "../../models/StudentsCourses";
import { Request, Response } from "express";
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcryptjs';
import * as crypto from "crypto";


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
})

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
    transporter.sendMail({
        from: 'LinkLearn <>',
        to: email,
        subject: 'Bem Vindo a LinkLearn',
        html: `<p>Olá ${request.body.name}, seja bem vindo ao LinkLearn.</p><br>
        <p>
            Acesse o site: <a href="http://localhost:3000/">LinkLearn</a>
            e de um up no seu futuro.
        </p>`,
    });

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
                user: "",
                pass: ""
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const newPassword = crypto.randomBytes(4).toString('HEX')

        transporter.sendMail({
            from: 'LinkLearn <>',
            to: email,
            subject: 'Recuperação de Senha',
            html: `<p>Olá, sua nova senha para acessar o portal é: ${newPassword}</p><br><a href="http://localhost:3000/">LinkLearn</a>`,
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
    const repository = getRepository(StudentsCourses)
    const id = request.userId;
    const courses = await (await repository.find({ where: { student: id }, relations: ["course", "course.teacher"] }));
    console.log(courses);
    return response.json(courses);
}

