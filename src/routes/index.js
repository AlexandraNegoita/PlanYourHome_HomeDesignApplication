import express from 'express';
import { app } from './defaultRoute';
export const routes = express.Router();
routes.use(app);
