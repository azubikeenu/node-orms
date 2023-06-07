import { AppDataSource } from '../database';
import { User } from '../entities/user.entity';
import {
  ConflictException,
  NotFoundException,
  ServerException,
} from '../exceptions/index';
import IUser from '../models/user.model';

const userRepository = AppDataSource.getRepository(User);
class UserService {
  static async listAll(): Promise<User[]> {
    const includedColumns = [
      'username',
      'email',
      'password',
      'role',
      'createdAt',
      'updatedAt',
    ];
    try {
      return await userRepository
        .createQueryBuilder()
        .select(includedColumns.map((col) => `user.${col}`).join(', '))
        .getRawMany();
    } catch (error: any) {
      throw new ServerException(error?.message);
    }
  }
  static async createUser(iuser: IUser): Promise<User> {
    const { email, password, username, role } = iuser;
    const user = userRepository.create({ email, password, username, role });
    try {
      const savedUser = await userRepository.save(user);
      return savedUser;
    } catch (error: any) {
      if ((error.code = '1062')) {
        throw new ConflictException('email already exists');
      } else {
        throw new ServerException('Something wrong happened');
      }
    }
  }

  static async findUser(id: number): Promise<User> {
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
    return user;
  }

  static async deleteUser(id: number): Promise<void> {
    const { affected } = await userRepository.delete({
      id,
    });
    if (affected === 0)
      throw new NotFoundException(
        `Could not delete! User with id ${id} not found `
      );
  }
}

export default UserService;
