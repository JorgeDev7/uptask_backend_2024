import { transporter } from "../config/nodemailer";

interface IEmail {
    email: string,
    name: string,
    token: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async ({ email, name, token }: IEmail) => {
        const info = await transporter.sendMail({
            from: 'Uptask <admin@uptask.com>',
            to: email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'UpTask - Confirma tu cuenta',
            html: `<p>Hola ${name}, has creado tu cuenta en UpTask, ya casi está todo listo, solo debes confirmar tu cuenta</p>

                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el código: <b>${token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        });

        console.log('Mensaje Enviado', info.messageId);
    };

    static sendPasswordResetToken = async ({ email, name, token }: IEmail) => {
        const info = await transporter.sendMail({
            from: 'Uptask <admin@uptask.com>',
            to: email,
            subject: 'UpTask - Reestablece tu password',
            text: 'UpTask - Reestablece tu password',
            html: `<p>Hola ${name}, has solicitado reestablecer tu password.</p>

                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>E ingresa el código: <b>${token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        });

        console.log('Mensaje Enviado', info.messageId);
    };
}