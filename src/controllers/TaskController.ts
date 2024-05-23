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
            const { taskId } = req.params;
            const task = await Task.findById(taskId);

            if (!task) {
                const error = new Error('Task not found');
                return res.status(404).json({
                    error: error.message
                });
            }
            if (task.project.toString() !== req.project.id) {
                const error = new Error('Invalid action');
                return res.status(400).json({
                    error: error.message
                });
            }

            res.json(task);

        } catch (error) {
            res.status(500).json({
                error: 'An error occurred'
            });
        }
    };
}