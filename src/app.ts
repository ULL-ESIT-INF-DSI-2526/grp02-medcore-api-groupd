import express from 'express';
import './db/mongoose.js';
import staffRouter from './routers/staff.js';
import cors from 'cors';


export const app = express();
app.use(cors());
app.use(express.json());
app.use('/staff', staffRouter);