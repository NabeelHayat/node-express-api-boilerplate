import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routers from './app.routes';
import { logStream } from '../utils/logger';

const app = express();

app.use(morgan('combined', { stream: logStream  }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mount all routes
app.use('/', routers);

export default app;