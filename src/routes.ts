import {Router, Request, Response } from 'express';
import authUserMiddleware from './app/middlewares/authUserMiddleware';
import { listStudents, saveUserStudent, updateStudent } from './app/controller/Student/StudentController';
import { deletePlan, listPlans, savePlans, updatePlan } from './app/controller/Plan/PlanController';
import { listTeachers, saveTeacher, updateTeacher } from "./app/controller/Teacher/TeacherController";
import AuthStudentUserController from './app/controller/Student/AuthStudentUserController';
import AuthTeacherUserController from './app/controller/Teacher/AuthTeacherUserController';
import { listCourses, saveCourse } from './app/controller/Course/CourseController';

const routes = Router();

routes.get('/', (request: Request, response: Response)=> {
    return response.json({message: 'Bem vindo a LinkLearn'});
});

//Rota so para testes
routes.get('/student/listAll', listStudents);

//Rotas para Usuario Aluno
routes.post('/student/create', saveUserStudent);
routes.post('/student/auth', AuthStudentUserController.authenticate);
routes.put('/student/update', authUserMiddleware,updateStudent);

//Rotas para Tabela Plans
routes.get('/plan/listAll', listPlans);
//Rotas futuras que serão rotas protegidas futuramente
routes.post('/plan/create', savePlans);
routes.put('/plan/update', updatePlan);
routes.delete('/plan/delete', deletePlan);


//Rotas para Tabela Teacher
routes.get('/teacher/listAll', listTeachers);
routes.post('/teacher/create', saveTeacher);
routes.post('/teacher/auth', AuthTeacherUserController.authenticate);
routes.put('/teacher/update', authUserMiddleware, updateTeacher);


routes.get('/courses/listAll', listCourses);
routes.post('/courses/create', authUserMiddleware, saveCourse);

export default routes;