import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/user.entity';
import { ServerException } from '../exceptions/index';

const userRepository = AppDataSource.getRepository(User);
class UserService {
  static async listAll() {
    try {
      return await userRepository.find();
    } catch (error: any) {
      throw new ServerException(error?.message);
    }
  }
}

export default UserService;
