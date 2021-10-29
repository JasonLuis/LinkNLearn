import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { Teacher } from "../../models/Teacher";
const key = process.env.JWT_KEY

export default new class AuthTeacherUserController {

    async authenticate(request: Request, response: Response) {
        const repository = getRepository(Teacher);
        const { email, password } = request.body;

        const user = await repository.findOne({ where: { email } });
        if (!user) {
            return response.sendStatus(401);
        }

        const token = jwt.sign({ id: user.id_teacher }, key, { expiresIn: '1d' });

        return response.json({
            user,
            token
        })
    }
}