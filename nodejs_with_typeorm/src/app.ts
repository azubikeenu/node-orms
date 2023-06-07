import express from 'express';
import { Express } from 'express';
import { Logger } from './utils/winston';
import { router } from './routes/index';
import errorsMiddleware from './middlewares/errors.middleware';
import notFoundMiddleware from './middlewares/not_found.middleware';

const logger = new Logger();

const app: Express = express();

app.use(express.json());

app.use(logger.getRequestLogger());

app.use('/api/v1', router);

// notFound middleware
app.use(notFoundMiddleware);

app.use(logger.getRequestErrorLogger());

//Global exception handler
app.use(errorsMiddleware);

export default app;
