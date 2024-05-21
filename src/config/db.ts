import { exit } from 'node:process';
import mongoose from "mongoose";
import colors from 'colors';

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.DATABASE_URL);
        const url = `${connection.host}:${connection.port}`;
        console.log(colors.magenta.bold(`MongoDB connected on: ${url}`));
    } catch (error) {
        // console.log(colors.bgRed.white(error.message));
        console.log(colors.red.bold('Error to connect to MongoDB'));
        exit(1);
    }
};