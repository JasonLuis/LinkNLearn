import { getRepository, Not } from "typeorm";
import { Request, Response } from "express";
import { Feedback } from "../../models/Feedback";

export const listFeedbackByCourse =  async(request: Request, response: Response) => {
    const { course } = request.body;
    const feedback = await getRepository(Feedback).find({where: {course: course},
         relations: ["course"]});
    return response.json(feedback);
}

export const createFeedBack = async(request: Request, response: Response) => {
    const repository = await getRepository(Feedback)
    const id = request.userId;
    const { id_course } = request.body;
    const feedExist = await repository.findOne({
        course: id_course,
        student: id as any,
    });

    if(feedExist) {
        return response.sendStatus(409).json(
            {
                message: "comment is exist!"
            }
        )
    }
    
    const body = {
       description: request.body.description,
       classification:  request.body.classification,
       course: request.body.course,
       student: request.userId,
    }

    const create = await  repository.create(body as any);
    const feedback = await repository.save(create);


    return response.json(feedback);
}