import { Router, Request, Response } from 'express';
import authUserMiddleware from './app/middlewares/authUserMiddleware';
import { buyCourses, forgotPassword, getStudentById, listAllByCourses, listStudents, saveUserStudent, updateStudent } from './app/controller/Student/StudentController';
import { deletePlan, listPlans, savePlans, updatePlan } from './app/controller/Plan/PlanController';
import { getTeacherById, getTeacherCourses, listTeachers, saveTeacher, updateTeacher } from "./app/controller/Teacher/TeacherController";
import AuthStudentUserController from './app/controller/Student/AuthStudentUserController';
import AuthTeacherUserController from './app/controller/Teacher/AuthTeacherUserController';
import { listCourses, saveCourse } from './app/controller/Course/CourseController';
import { createFeedBack, listFeedbackByCourse } from './app/controller/Feedback/FeedbackController';

const routes = Router();

const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, 'uploads/');
        },
        filename: (req, file, callback) => {
            const type = file.mimetype.split('/')[1];
            callback(null, file.originalname + '-' + Date.now() + '.' + type);
        }
    })
});

routes.get('/', (request: Request, response: Response) => {
    return response.json({ message: 'Bem vindo a LinkLearn' });
});

//Rota so para testes
routes.get('/student/listAll', listStudents);

//Rotas para Usuario Aluno
routes.post('/student/create', saveUserStudent);
routes.post('/student/auth', AuthStudentUserController.authenticate);
routes.put('/student/update', authUserMiddleware, updateStudent);
routes.post('/student/buy', authUserMiddleware, buyCourses);
routes.post('/student/listCourses', authUserMiddleware, listAllByCourses);
routes.post('/student/getById', authUserMiddleware, getStudentById);
routes.post('/student/forgot-password', forgotPassword);
routes.post('/student/upload/profile', authUserMiddleware, upload.single('photo'), function (req, res, next) {
    return res.status(200);
});


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
routes.post('/teacher/getById', authUserMiddleware, getTeacherById);
routes.post('/teacher/courses', authUserMiddleware, getTeacherCourses);

routes.get('/courses/listAll', listCourses);
routes.post('/courses/create', authUserMiddleware, saveCourse);


// Feedback
routes.post('/course/listAllFeedback', listFeedbackByCourse); //listar
routes.post('/course/feedback', authUserMiddleware, createFeedBack);//criar

export default routes;