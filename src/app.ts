import express from 'express';
import staffRouter from './routers/staff.js';
import { patientRouter } from './routers/patients.js';
import { medicationRouter } from './routers/medications.js';
import cors from 'cors';
import { recordRouter } from './routers/records.js';
import { setupSwagger } from './swagger.js';

export const app = express();
app.use(cors());
app.use(express.json());
app.use('/staff', staffRouter);
app.use(patientRouter);
app.use('/medications', medicationRouter);
app.use(recordRouter);

setupSwagger(app);
