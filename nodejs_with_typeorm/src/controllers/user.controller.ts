import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';
import { StatusCodes } from 'http-status-codes';

import { omit, omitBy } from 'lodash';
import { privateFields } from '../entities/user.entity';

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

  static async createUser(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const savedUser = await UserService.createUser(request.body);
      return response
        .status(StatusCodes.CREATED)
        .json({ success: true, data: omit(savedUser, privateFields) });
    } catch (err: any) {
      next(err);
    }
  }

  static async findUser(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(request.params.id);
      const foundUser = await UserService.findUser(id);

      return response
        .status(StatusCodes.OK)
        .json({ success: true, data: omit(foundUser, privateFields) });
    } catch (err: any) {
      next(err);
    }
  }
}

export default UserController;
