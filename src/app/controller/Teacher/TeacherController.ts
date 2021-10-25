import { createQueryBuilder, getRepository, Not } from "typeorm";
import { Teacher } from "../../models/Teacher";
import { Course } from "../../models/Course";
import { Request, Response } from "express";
import * as nodemailer from "nodemailer";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { Plan } from "../../models/Plan";

export const listTeachers = async (request: Request, response: Response) => {
  const teacher = await getRepository(Teacher).find({ relations: ["plan"] });

  return response.json(teacher);
};

export const getTeacherById = async (request: Request, response: Response) => {
  const repository = await getRepository(Teacher);
  const id = request.userId;
  const teacher = await repository.find({ where: { id_teacher: id }, relations: ["course"]});

  return response.json(teacher);
};

export const getTeacherCourses = async (
  request: Request,
  response: Response
) => {
  const repository = await getRepository(Course);
  const { teacher } = request.body;
  const courses = await repository.find({ where: { teacher: teacher }, relations: ["teacher"] });

  return response.json(courses);
};

export const saveTeacher = async (request: Request, response: Response) => {
  const repository = await getRepository(Teacher);
  const { cpf, email } = request.body;

  const emailExists = await repository.findOne({ where: { email } });
  const cpfExists = await repository.findOne({ where: { cpf } });

  if (emailExists || cpfExists) {
    return response.sendStatus(409);
  }

  const teacher = repository.create(request.body);
  const userteacher = await repository.save(teacher);

  return response.json(userteacher);
};

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
      message: "CPF or email used by another user",
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
};

export const forgotPasswordTeacher = async (
  request: Request,
  response: Response
) => {
  const { email } = request.body;

  try {
    const user = await getRepository(Teacher).find({
      where: {
        email,
      },
    });

    if (user.length === 0) {
      return response.status(404).json({
        message: "User not found",
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
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "linklearninc@gmail.com",
        pass: "Linklearn123",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const newPassword = crypto.randomBytes(4).toString("HEX");

    transporter
      .sendMail({
        from: "LinkLearn <457f7a1349-e88ec1@inbox.mailtrap.io>",
        to: email,
        subject: "Recuperação de Senha",
        html: `<p>Olá, sua nova senha para acessar o portal é: ${newPassword}</p><br><a href="http://localhost:3000/">LinkLearn</a>`,
      })
      .then(() => {
        bcrypt.hash(newPassword, 8).then((password) => {
          getRepository(Teacher)
            .update(user[0].id_teacher, {
              password,
            })
            .then(() => {
              return response.status(200).json({ message: "Email sended" });
            })
            .catch(() => {
              return response.status(404).json({ message: "User not found" });
            });
        });
      });
  } catch (error) {
    return response.status(422).json({ message: "Fail to send email" });
  }
};


export const listCourseByTeacher =  async (req: Request, res: Response) => {
  const { id_teacher } = req.body;
  const repoCourses = await getRepository(Course);

  const teacher = await getRepository(Teacher).find({relations: ["course"]});
}