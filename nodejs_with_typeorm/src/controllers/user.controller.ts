import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';
import { StatusCodes } from 'http-status-codes';

class UserController {
  static async listAll(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const users = await UserService.listAll();
      return response.status(StatusCodes.OK).json({
        success: true,
        data: {
          users,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default UserController;
