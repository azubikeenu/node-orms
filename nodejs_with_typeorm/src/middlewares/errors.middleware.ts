import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { Logger } from '../utils/winston';

const logger = new Logger();

function errorsMiddleware(
  error: HttpError,
  req: Request,
  response: Response,
  next: NextFunction
) {
  const { statusCode = 500, message, stack } = error;
  // store the error message in the locals
  response.locals.errorMessage = message;

  let errorMessage: { [key: string]: any } = { message };

  if (process.env.NODE_ENV === 'development') {
    errorMessage = { message, stack };
  }
  logger.log.error(errorMessage);
  response.status(statusCode).json({ success: false, error: errorMessage });
}

export default errorsMiddleware;
