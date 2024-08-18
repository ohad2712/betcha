import express from 'express';
import authRoutes from './routes/authRoutes';
import { json } from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(json());

app.use('/api/auth', authRoutes);

export default app;
