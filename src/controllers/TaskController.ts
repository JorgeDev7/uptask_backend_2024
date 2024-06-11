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
            const task = await Task.findById(req.task.id)
                .populate({ path: 'completedBy.user', select: 'id name email' });
            res.json(task);

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

            const data = {
                user: req.user.id,
                status
            };

            req.task.completedBy.push(data);
            await req.task.save();

            res.send('Estado actualizado');

        } catch (error) {
            res.status(500).json({
                error: 'Ocurrió un error'
            });
        }
    };
}