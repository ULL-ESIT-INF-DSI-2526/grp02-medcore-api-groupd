import {app} from '../app.js';

const port = process.env.PORT || 3000;

app.get('/staff', (req, res) => {
  res.send('Staff route');
});