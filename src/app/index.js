import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import AuthService from '../shared/auth.service';
import appRoutes from './app.routes';
import { logStream } from '../utils/logger';
import { errorConverter, errorHandler, notFound } from '../middlewares/errorHandler';
import config from '../config';

const app = express();

app.set('port', config.port);
app.set('host', config.host);

app.locals.title = config.appName;
app.locals.version = config.appVersion;

if (config.env === 'development') {
	app.use(morgan('combined', { stream: logStream  }));
}

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// set security HTTP headers**+
app.use(helmet());

// Set "Access-Control-Allow-Origin" header
app.use(
	cors({
		origin: [
			'http://localhost:3000',
			'http://localhost:5000',
		],
		optionsSuccessStatus: 200,
		credentials: true,
	}),
);

// Enable authentication using session + passport
app.use(
	session({
		secret: config.mongoose.url,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({ mongoUrl: config.mongoose.url }),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
		},
	}),
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------.
 */

AuthService(app);

/**
 * -------------- ROUTES ----------------.
 */

// mount all routes
app.use('/', appRoutes);

// if error is not an instanceOf APIError, convert it.
app.use(errorConverter);

// catch 404 and forward to error handler
app.use(notFound);

// error handler, send stacktrace only during development
app.use(errorHandler);

export default app;