import express from 'express';
import './db/mongoose.js';

export const app = express();
app.use(express.json());
