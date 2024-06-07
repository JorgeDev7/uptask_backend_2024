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

    static removeMemberById = async (req: Request, res: Response) => {
        const { id } = req.body;

        if (!req.project.team.some(team => team.toString() === id)) {
            const error = new Error('El usuario no existe en el proyecto');
            return res.status(409).json({
                error: error.message
            });
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== id);
        await req.project.save();

        res.send('Usuario eliminado correctamente');
    };
}