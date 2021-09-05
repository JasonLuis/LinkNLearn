import {Router, Request, Response } from 'express';
import authStudentMiddleware from './app/middlewares/authStudentMiddleware';
import { listStudents, saveUserStudent, updateStudent } from './app/controller/StudentController';
import AuthStudentUserController from './app/controller/AuthStudentUserController';


const routes = Router();

routes.get('/', (request: Request, response: Response)=> {
    return response.json({message: 'Bem vindo a LinkLearn'});
});

//Rota so para testes
routes.get('/student/listAll', listStudents);
routes.post('/student/create', saveUserStudent);
routes.post('/student/auth', AuthStudentUserController.authenticate);
routes.put('/student/update', authStudentMiddleware,updateStudent);

export default routes;