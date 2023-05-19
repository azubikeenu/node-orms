import express from 'express';
import { Express, Response, Request, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import Logger from './utils/logger';

const app: Express = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  return res
    .status(404)
    .json({ status: 'Error', message: ` ${req.path} not found` });
});

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
    Logger.error(message);
    response.status(status).json({ status: 'Error', error: errorMessage });
  }
);

export default app;
