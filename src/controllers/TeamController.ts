import { Request, Response } from "express";
import User from "../models/User";

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body;

        try {
            // Find User
            const user = await User.findOne({ email }).select('id email name');
            if (!user) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({
                    error: error.message
                });
            }

            res.json(user);
        } catch (error) {
            console.log(error);
        }
    };

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body;
        try {

            const user = await User.findById(id).select('id');
            if (!user) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({
                    error: error.message
                });
            }

            if (req.project.team.some(team => team.toString() === user.id.toString())) {
                const error = new Error('El usuario ya ha sido añadido al Proyecto');
                return res.status(409).json({
                    error: error.message
                });
            }

            req.project.team.push(user.id);
            await req.project.save();

            res.send('Usuario agregado correctamente');
        } catch (error) {
            console.log(error);
        }
    };
}