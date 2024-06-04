import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body;

            // Prevent duplicated users
            const userExists = await User.findOne({ email });
            if (userExists) {
                const error = new Error('El Usuario ya está registrado');
                return res.status(409).json({
                    error: error.message
                });
            }

            // Create a user
            const user = new User(req.body);

            // Hash Password
            user.password = await hashPassword(password);

            // Generate token   
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;

            // Send Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });

            await Promise.allSettled([user.save(), token.save()]);

            res.send('Cuenta creada, revisa tu email para confirmarla');
        } catch (error) {
            res.status(500).json({
                error: 'Hubo un error'
            });
        }
    };

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            const tokenExist = await Token.findOne({ token });

            if (!tokenExist) {
                const error = new Error('Token no válido');
                return res.status(404).json({
                    error: error.message
                });
            }

            const user = await User.findById(tokenExist.user);
            user.confirmed = true;

            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            res.send('Cuenta confirmada correctamente');
        } catch (error) {
            res.status(500).json({
                error: 'Hubo un error'
            });
        }
    };


    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({
                    error: error.message
                });
            }

            if (!user.confirmed) {
                const token = new Token();
                token.token = generateToken();
                token.user = user.id;
                await token.save();

                // Send Token
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                });

                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación');
                return res.status(401).json({
                    error: error.message
                });
            }

            // Check password
            const isPasswordCorrect = await checkPassword(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error('Password Incorrecto');
                return res.status(401).json({
                    error: error.message
                });
            }

            res.send("Autenticado...");

        } catch (error) {
            res.status(500).json({
                error: 'Hubo un error'
            });
        }
    };

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // User Exist
            const user = await User.findOne({ email });
            if (!user) {
                const error = new Error('El Usuario no está registrado');
                return res.status(404).json({
                    error: error.message
                });
            }

            if (user.confirmed) {
                const error = new Error('El Usuario ya está confirmado');
                return res.status(403).json({
                    error: error.message
                });
            }

            // Generate token   
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;

            // Send Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });

            await Promise.allSettled([user.save(), token.save()]);

            res.send('Se envió un nuevo token a tu e-mail');
        } catch (error) {
            res.status(500).json({
                error: 'Hubo un error'
            });
        }
    };

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // User Exist
            const user = await User.findOne({ email });
            if (!user) {
                const error = new Error('El Usuario no está registrado');
                return res.status(404).json({
                    error: error.message
                });
            }

            // Generate token   
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;
            await token.save();

            // Send Email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            });
            res.send('Revisa tu email para instrucciones');
        } catch (error) {
            res.status(500).json({
                error: 'Hubo un error'
            });
        }
    };

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            const tokenExist = await Token.findOne({ token });

            if (!tokenExist) {
                const error = new Error('Token no válido');
                return res.status(404).json({
                    error: error.message
                });
            }

            res.send('Token válido, define tu nueva contraseña');
        } catch (error) {
            res.status(500).json({
                error: 'Hubo un error'
            });
        }
    };

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const tokenExist = await Token.findOne({ token });

            if (!tokenExist) {
                const error = new Error('Token no válido');
                return res.status(404).json({
                    error: error.message
                });
            }

            const user = await User.findById(tokenExist.user);
            user.password = await hashPassword(password);

            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

            res.send('La contraseña ha sido modificada correctamente');
        } catch (error) {
            res.status(500).json({
                error: 'Hubo un error'
            });
        }
    };
}