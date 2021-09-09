import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { Student } from "../../models/Student";
const key = process.env.JWT_KEY
class AuthStudentUserController {
    async authenticate(request: Request, response: Response) {
        const repository = getRepository(Student);
        const { email, password } = request.body;

        const user = await repository.findOne({ where: { email } });

        if(!user) {
            return response.sendStatus(401);
        }

        const token = jwt.sign({id: user.id_student}, key, {expiresIn: '1d'});

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword){
            return response.sendStatus(401);
        }
        //delete user.password;
        
        return response.json({
            user,
            token
        })

    }
}

export default new AuthStudentUserController()