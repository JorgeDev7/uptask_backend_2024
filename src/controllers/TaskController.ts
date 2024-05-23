import { Request, Response } from 'express';
import Task from "../models/Task";


export class TaskController {
    static createTask = async (req: Request, res: Response) => {

        const { project } = req;

        try {

            const task = new Task(req.body);
            task.project = project.id;
            project.tasks.push(task.id);

            await Promise.allSettled([task.save(), project.save()]);

            res.send('Task created successfully');

        } catch (error) {
            res.status(500).json({
                error: 'An error occurred'
            });
        }
    };

    static getProjectsTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({
                project: req.project.id
            }).populate('project'); //value on the model;

            res.json(tasks);
        } catch (error) {
            res.status(500).json({
                error: 'An error occurred'
            });
        }
    };
}