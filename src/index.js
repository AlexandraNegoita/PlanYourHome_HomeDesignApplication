import express from 'express';
import dotenv from 'dotenv';
import { routes } from './routes';
const app = express();
dotenv.config();
// routes
app.use('/', routes);
// start the server
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});
