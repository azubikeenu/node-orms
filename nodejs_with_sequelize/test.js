const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;

const sequelize = new Sequelize('testdb', 'admin', 'userpass', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

const Student = sequelize.define('student', {
  student_id: {
    type: DataTypes.INTEGER,
    primarykey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 20],
    },
  },
  favoorite_class: {
    type: DataTypes.STRING,
    defaultValue: 'computer_science',
  },
  subscribed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  school_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
