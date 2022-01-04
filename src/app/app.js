import express from 'express';
import routes from './app.routes';

const app = express();

// mount all routes
app.use('/', routes());

// Export default is not perferred for CommonJS.
export default app;