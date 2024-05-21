import type { Request, Response } from "express";

export class ProjectController {

    static getAllProject = async (req: Request, res: Response) => {
        res.send('Todos los projecto');
    };

}