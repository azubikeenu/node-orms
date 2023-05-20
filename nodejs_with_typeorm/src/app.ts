import express from 'express';
import { Express, Response, Request, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { Logger } from './utils/winston';

const logger = new Logger();

const app: Express = express();

app.use(logger.getRequestLogger());

app.use((req: Request, res: Response, next: NextFunction) => {
  return res
    .status(404)
    .json({ status: 'Error', message: ` ${req.path} not found` });
});

app.use(logger.getRequestErrorLogger());

//Global exception handler

app.use(
  (error: HttpError, req: Request, response: Response, next: NextFunction) => {
    const { status = 500, message, stack } = error;
    // store the error message in the locals
    response.locals.errorMessage = message;

    let errorMessage: { [key: string]: any } = { message };

    if (process.env.NODE_ENV === 'development') {
      errorMessage = { message, stack };
    }
    //logger.log().error(errorMessage);
    logger.log.error(errorMessage);
    response.status(status).json({ status: 'Error', error: errorMessage });
  }
);

export default app;
