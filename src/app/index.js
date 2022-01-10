import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routers from './app.routes';
import { logStream } from '../utils/logger';
import { errorConverter, errorHandler, notFound } from '../middlewares/errorHandler';

const app = express();

app.use(morgan('combined', { stream: logStream  }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mount all routes
app.use('/', routers);

// if error is not an instanceOf APIError, convert it.
app.use(errorConverter);

// catch 404 and forward to error handler
app.use(notFound);

// error handler, send stacktrace only during development
app.use(errorHandler);

export default app;