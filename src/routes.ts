import { Router, Request, Response } from 'express';
import authUserMiddleware from './app/middlewares/authUserMiddleware';
import { buyCourses, forgotPassword, getStudentById, listAllByCourses, listStudents, saveUserStudent, updateStudent } from './app/controller/Student/StudentController';
import { deletePlan, listPlans, savePlans, updatePlan } from './app/controller/Plan/PlanController';
import { forgotPasswordTeacher, getTeacherById, getTeacherCourses, listTeachers, saveTeacher, updateTeacher } from "./app/controller/Teacher/TeacherController";
import AuthStudentUserController from './app/controller/Student/AuthStudentUserController';
import AuthTeacherUserController from './app/controller/Teacher/AuthTeacherUserController';
import { getCoursesById, listCourses, saveCourse, updateCourse } from './app/controller/Course/CourseController';
import { createFeedBack, listFeedbackByCourse } from './app/controller/Feedback/FeedbackController';
import { listCategories, saveCategory } from './app/controller/Category/CategoryController';
import { createCart, listCart } from './app/controller/Cart/CartController';

const routes = Router();

const multer = require('multer');
const fileSystem = require('fs');

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

//Rotas de categoria de cursos
routes.get('/category/listAll', listCategories);
routes.post('/category/save', saveCategory);

const uploadAvatar = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, __dirname + '\\uploads\\avatar\\');
        },
        filename: (req, file, callback) => {
            const type = file.mimetype.split('/')[1];
            callback(null, req.userId + '.' + type);
        }
    })
});

routes.post('/user/upload/avatar', authUserMiddleware, uploadAvatar.single('photo'), function (req, res, next) {
    res.status(200).end();
});
routes.get('/user/upload/avatar', function (req, res, next) {
    const filePath = __dirname + '\\uploads\\avatar\\' + req.headers.userid + '.jpeg';

    if (fileSystem.existsSync(filePath)) {
        fileSystem.readFile(filePath, function (err, data) {
            var base64 = Buffer.from(data).toString('base64');
            base64 = 'data:image/jpeg;base64,' + base64;
            res.send(base64);
        });
    } else {
        res.status(404).end();
    }

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
routes.post('/teacher/forgot-password', forgotPasswordTeacher);

routes.get('/courses/listAll', listCourses);
routes.post('/courses/create', authUserMiddleware, saveCourse);
routes.put('/courses/update', authUserMiddleware, updateCourse);


const uploadThumb = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, __dirname + '\\uploads\\thumbnail\\');
        },
        filename: (req, file, callback) => {
            const type = file.mimetype.split('/')[1];
            callback(null, req.headers.courseid + '.' + type);
        }
    })
});

routes.post('/course/upload/thumbnail', authUserMiddleware, uploadThumb.single('photo'), function (req, res, next) {
    res.status(200).end();
});
routes.get('/course/upload/thumbnail', function (req, res, next) {

    const filePath = __dirname + '\\uploads\\thumbnail\\' + req.headers.courseid + '.jpeg';

    if (fileSystem.existsSync(filePath)) {
        fileSystem.readFile(filePath, function (err, data) {
            var base64 = Buffer.from(data).toString('base64');
            base64 = 'data:image/jpeg;base64,' + base64;
            res.send(base64);
        });
    } else {
        res.status(404).end();
    }
});

// Feedback
routes.post('/course/listAllFeedback', listFeedbackByCourse); //listar
routes.post('/course/feedback', authUserMiddleware, createFeedBack);//criar
routes.post('/course/getById', getCoursesById);


// Shopping Cart
routes.get('/course/buy/listAll',authUserMiddleware, listCart);
routes.post('/course/buy/create-cart',authUserMiddleware, createCart);
export default routes;