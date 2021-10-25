import { getRepository, Not } from "typeorm";
import { Course } from '../../models/Course';
import { Request, Response } from "express";

interface Courses{
    id_course?: string;
    title: string;
    description: string;
    level: string;
    startDate: Date;
    finishDate: Date;
    period: string;
    classDate: string;
    maxStudent: number;
    price: number;
    platform: string;
    logoCourse: string;
    hours: string;
    teacher: string;
};

export const listCourses = async(req: Request, res: Response) => {
    const courses = await getRepository(Course).find({relations: ["teacher","category"]});

    return res.json(courses);
}

export const getCoursesById = async(req: Request, res: Response) => {
    const repository = await getRepository(Course);
    const { id_course } = req.body;
    const course = await repository.find({ where: { id_course: id_course }, relations: ["teacher"] });
    
    return res.json(course);
}

export const saveCourse = async(req: Request, res: Response) => {
    const repository = getRepository(Course);
    const id = req.userId;
    
    const create:Courses = {
        title: req.body.title,
        description: req.body.description,
        level: req.body.level,
        startDate: req.body.startDate,
        finishDate: req.body.finishDate,
        period: req.body.period,
        classDate: req.body.classDate,
        maxStudent: req.body.maxStudent,
        price: req.body.price,
        platform: req.body.platform,
        logoCourse: req.body.logoCourse,
        hours: req.body.hours,
        teacher: id,
    }
    
    const courses = await repository.create(create as any);
    const cadCourses = await repository.save(courses);
    if(!cadCourses){
        return res.sendStatus(409);
    }

    return res.json(cadCourses);
}

export const updateCourse = async (request: Request, response: Response) => {
    const repository = await getRepository(Course)
    const id = request.body.id_course
    if(!id){
        return response.sendStatus(409).json({
            message: ""
        });
    }

    const course = repository.create(request.body);
    const user = await repository.update(id, course as any);

    if (user.affected === 1) {
        const userUpdate = await repository.findOne(id);
        return response.json(userUpdate);
    }

    return response.status(404).json({
        message: "User not found",
    });
}