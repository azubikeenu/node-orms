import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsTo(models['User']);
    }
  }

  Role.init(
    {
      role: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
    }
  );
  return Role;
};
