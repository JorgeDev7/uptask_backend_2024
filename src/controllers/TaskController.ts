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

    static getTaskById = async (req: Request, res: Response) => {

        try {

            res.json(req.task);

        } catch (error) {
            res.status(500).json({
                error: 'An error occurred'
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

            res.send('Tasks updated successfully');

        } catch (error) {
            res.status(500).json({
                error: 'An error occurred'
            });
        }
    };

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString());
            await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

            res.send('Tasks Deleted successfully');

        } catch (error) {
            res.status(500).json({
                error: 'An error occurred'
            });
        }
    };

    static updateStatus = async (req: Request, res: Response) => {
        try {

            const { status } = req.body;
            req.task.status = status;
            await req.task.save();

            res.send('Status Updated');

        } catch (error) {
            res.status(500).json({
                error: 'An error occurred'
            });
        }
    };
}