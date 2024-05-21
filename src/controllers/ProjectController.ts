import type { Request, Response } from "express";

import Project from "../models/project";

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {

        const project = new Project(req.body);

        try {
            await project.save();
            res.send('Projecto Creado Correctamente');
        } catch (error) {
            console.log(error);
        }
    };

    static getAllProject = async (req: Request, res: Response) => {

        try {
            const projects = await Project.find({});
            res.json(projects);
        } catch (error) {
            console.log(error);
        }
    };

    static getProjectById = async (req: Request, res: Response) => {

        const { id } = req.params;

        try {
            const project = await Project.findById(id);

            if (!project) {
                const error = new Error('Project not found');
                return res.status(404).json({
                    error: error.message
                });
            }

            res.json(project);
        } catch (error) {
            console.log(error);
        }
    };

}