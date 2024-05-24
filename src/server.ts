import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes';

dotenv.config();
connectDB();

const app = express();

// CORS
app.use(cors(corsConfig));

// Enabling JSON
app.use(json());

// Routes
app.use('/api/projects', projectRoutes);

export default app;