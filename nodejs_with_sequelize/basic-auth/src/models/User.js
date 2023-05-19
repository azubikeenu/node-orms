import '../config';

import { Model, DataTypes } from 'sequelize';

import bcrypt from 'bcrypt';

import environment from '../config/env';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models['Role']);

      User.hasOne(models['RefreshToken'], {
        onDelete: 'CASCADE',
      });
    }

    static async hashPassword(password) {
      return bcrypt.hash(password, environment.saltRounds);
    }

    static async comparePassword(password, hashedPassword) {
      return bcrypt.compare(password, hashedPassword);
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
