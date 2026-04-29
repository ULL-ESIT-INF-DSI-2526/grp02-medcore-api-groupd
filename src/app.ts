import express from 'express';
import './db/mongoose.js';
import staffRouter from './routers/staff.js';

export const app = express();
app.use(express.json());
app.use('/staff', staffRouter);