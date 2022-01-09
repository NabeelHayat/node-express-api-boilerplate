import express from 'express';
import cors from 'cors';
import routers from './app.routes';

const app = express();

// app.use(morgan('combined', { stream: logStream }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mount all routes
app.use('/', routers);

export default app;