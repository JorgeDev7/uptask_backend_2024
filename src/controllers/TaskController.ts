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

            res.send('Tarea creada correctamente');

        } catch (error) {
            res.status(500).json({
                error: 'Ocurrió un error'
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
                error: 'Ocurrió un error'
            });
        }
    };

    static getTaskById = async (req: Request, res: Response) => {

        try {

            res.json(req.task);

        } catch (error) {
            res.status(500).json({
                error: 'Ocurrió un error'
            });
        }
    };

    static updateTask = async (req: Request, res: Response) => {
        try {
            // adding updated data
            req.task.name = req.body.name;
            req.task.description = req.body.description;

            // save changes
            await req.task.save();

            res.send('Tarea actualizada correctamente');

        } catch (error) {
            res.status(500).json({
                error: 'Ocurrió un error'
            });
        }
    };

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString());
            await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

            res.send('Tarea eliminada');

        } catch (error) {
            res.status(500).json({
                error: 'Ocurrió un error'
            });
        }
    };

    static updateStatus = async (req: Request, res: Response) => {
        try {

            const { status } = req.body;
            req.task.status = status;
            if (status === 'pending') {
                req.task.completedBy = null;
            } else {
                req.task.completedBy = req.user.id;
            }
            await req.task.save();

            res.send('Estado actualizado');

        } catch (error) {
            res.status(500).json({
                error: 'Ocurrió un error'
            });
        }
    };
}