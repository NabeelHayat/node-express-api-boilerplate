import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import apiRoutes from './app.routes';
import { logStream } from '../utils/logger';
import { errorConverter, errorHandler, notFound } from '../middlewares/errorHandler';
import config from '../config';
import compression from 'compression';

const app = express();

app.set('port', config.port);
app.set('host', config.host);

app.locals.title = config.appName;
app.locals.version = config.appVersion;

app.use(morgan('combined', { stream: logStream  }));

// set security HTTP headers**+
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// mount all routes
app.use('/', apiRoutes);

// if error is not an instanceOf APIError, convert it.
app.use(errorConverter);

// catch 404 and forward to error handler
app.use(notFound);

// error handler, send stacktrace only during development
app.use(errorHandler);

export default app;