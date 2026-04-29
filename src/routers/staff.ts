import {app} from '../app.js';
import { Router } from 'express';

const staffRouter = Router();

staffRouter.get('/', (req, res) => {
    res.send('Staff endpoint');
});

export default staffRouter;