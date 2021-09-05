import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

interface TokenID {
    id: string;
    iat: number;
    exp: number;
}
const key = process.env.JWT_KEY
export default function authStudentMiddleware(
    request: Request, response: Response, next: NextFunction
){

    const { authorization } = request.headers;

    if(!authorization) {
        return response.sendStatus(401);
    }

    const token = authorization.replace('Bearer', '').trim();

    try {
        const data = jwt.verify(token, key);
        const { id } = data as TokenID;

        request.userId = id;

        return next();
    } catch (error) {
        return response.sendStatus(401);
    }
}   