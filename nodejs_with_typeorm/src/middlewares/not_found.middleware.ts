import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ status: 'Error', message: ` ${req.path} not found` });
}

export default notFoundMiddleware;
