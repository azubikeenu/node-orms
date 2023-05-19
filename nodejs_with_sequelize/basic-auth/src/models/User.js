import '../config';

import { Model, DataTypes } from 'sequelize';

import bcrypt from 'bcrypt';

import environment from '../config/env';

import JwtUtils from '../utils/jwt.utils';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.Roles = User.hasMany(models['Role']);
      User.RefreshToken = User.hasOne(models['RefreshToken'], {
        onDelete: 'CASCADE',
      });
    }

    static async hashPassword(password) {
      return bcrypt.hash(password, environment.saltRounds);
    }

    static async comparePassword(password, hashedPassword) {
      return bcrypt.compare(password, hashedPassword);
    }

    static async createUser({ email, password, roles }) {
      const result = await sequelize.transaction(async () => {
        const payload = { email };

        // Generate an access token
        const accessToken = JwtUtils.generateAccessToken(payload);
        // Generate a refresh token
        const refreshToken = JwtUtils.generateRefreshToken(payload);
        // Create Roles
        let rolesToSave = [];
        if (roles && Array.isArray(roles)) {
          rolesToSave = roles.map((role) => ({ role }));
        }

        //create user with assc
        await User.create(
          {
            email,
            password,
            Roles: rolesToSave,
            RefreshToken: { token: refreshToken },
          },
          { include: [User.Roles, User.RefreshToken] }
        );
        return { accessToken, refreshToken };
      });

      return result;
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'not a valid email address',
          },
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      userName: {
        type: DataTypes.STRING(50),
        unique: true,
      },

      firstName: {
        type: DataTypes.STRING(50),
        validate: {
          len: {
            args: [0, 50],
            msg: 'first name must have characters between 0-50',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING(50),
        validate: {
          len: {
            args: [0, 50],
            msg: 'last name must have characters between 0-50',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
    }
  );
  User.beforeSave(async (user, _) => {
    const hashedPassword = await User.hashPassword(user.password);
    user.password = hashedPassword;
  });

  return User;
};
