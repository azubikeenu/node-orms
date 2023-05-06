const Sequelize = require('sequelize');
const Bcrypt = require('bcrypt');

const zlib = require('zlib');

const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize('testdb', 'admin', 'userpass', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

// sequelize.drop({match : /_test$/});

// Create user model
const User = sequelize.define('user', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('username');
      return rawValue.toUpperCase();
    },
  },
  password: {
    type: DataTypes.STRING,
    set(value) {
      const salt = Bcrypt.genSaltSync(12);
      const hash = Bcrypt.hashSync(value, salt);
      this.setDataValue('password', hash);
    },
  },
  age: {
    type: DataTypes.INTEGER,
    defaultValue: 21,
    // Custom validation
    validate: {
      //   isOldEnough(value) {
      //     if (value < 21) {
      //       throw new Error(`Too young`);
      //     }
      //   },
      //   isIn: {
      //     args: [1, 2, 3],
      //     msg : 'must be one of the following'
      //   },
    },
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultvalue: false,
  },

  description: {
    type: DataTypes.STRING,
    set(value) {
      const compressed = zlib.deflateSync(value).toString('base64');
      this.setDataValue('description', compressed);
    },
    get() {
      const value = this.getDataValue('description');
      const uncompressed = zlib.inflateSync(Buffer.from(value, 'base64'));
      return uncompressed.toString();
    },
  },
  about_user: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.username + ' ' + this.description;
    },
  },
});

User.sync({ alter: true })
  .then(() => {
    console.log(`table user syncd successfully`);

    //BULK CREATE
    // return User.bulkCreate([
    //   {
    //     username: 'Richard',
    //     password: 'userpass',
    //     age: 34,
    //     description: 'hello world this is a fucking desc ',
    //   },
    //   {
    //     username: 'Amaka',
    //     password: 'userpass',
    //     age: 30,
    //     description: 'hello world this is a fucking desc ',
    //   },
    // ]);

    // return User.findAll();
    // return User.findAll({
    //   attributes: [
    //     ['username', 'uname'],
    //     ['password', 'pwd'],
    //   ],
    // });

    ///-- Aggregate functions ----///
    // return User.findAll({
    //   attributes: [[sequelize.fn('SUM', sequelize.col('age')), 'howOld']],
    // });

    ///-------- FIND QUERIES ------------/////
    // return User.findAll({ attributes: ['username'], where: { age: 21 } });

    //// -------- LIMIT --------------//////
    // return User.findAll({ limit: 1 });

    ////---------- SORTING ----------///////
    // return User.findAll({ order: [['age', 'DESC']] });

    ///// ---------- GROUPING --------////////
    // SELECT `username`, SUM(`age`) AS `sum_age` FROM `users` AS `user` GROUP BY `username`;
    // return User.findAll({
    //   attributes: [
    //     'username',
    //     [sequelize.fn('SUM', sequelize.col('age')), 'sum_age'],
    //   ],
    //   group: 'username',
    // });

    ////////////// OR OPERATOR //////////////
    //SELECT `user_id`, `username`, `password`, `age`, `isActive`, `createdAt`,
    //`updatedAt` FROM `users` AS `user` WHERE (`user`.`username` = 'Azubike' OR `user`.`age` = 33)
    // return User.findAll({
    //   where: {
    //     [Op.or]: { username: 'Azubike', age: 33 },
    //   },
    // });

    ///// GreaterThan / Number Comparison////////
    //SELECT `user_id`, `username`, `password`, `age`, `isActive`, `createdAt`,
    //`updatedAt` FROM `users` AS `user` WHERE `user`.`age` > 25;
    // return User.findAll({
    //   where: {
    //     age: {
    //       [Op.gt]: 25,
    //     },
    //   },
    // });
    //SELECT `user_id`, `username`, `password`, `age`, `isActive`, `createdAt`,
    //`updatedAt` FROM `users` AS `user` WHERE (`user`.`age` > 25 OR `user`.`age` IS NULL);
    // return User.findAll({
    //   where: {
    //     age: {
    //       [Op.or]: {
    //         [Op.gt]: 25,
    //         [Op.eq]: null,
    //       },
    //     },
    //   },
    // });

    /////////// UPDATE QUERIES /////////////////////
    // return User.update({ username: 'richard' }, { where: { user_id: 1 } });

    ////////  DELETE QUERIES
    // return User.destory({truncate : true}) // deletes all records in the table
    // return User.destory({ where: { id: 1 } });

    /// UTILITY METHODS
    // Max
    // return User.max('age');
    // Sum
    // return User.sum('age')
    // Count
    // return User.count('id');

    ///// RETURNING RAW DATA
    // return User.findAll({ age: { [Op.gt]: 23 }, raw: true });

    /// FIND BY PK [PrimaryKey]
    // return User.findByPk(1);

    /// FINDONE METHOD
    // return User.findOne({ where: { user_id: 1 } });

    // FINDORCREATE
    // return User.findOrCreate({
    //   where: { username: 'Boma' },
    //   defaults: {
    //     password: 'userpass',
    //     age: 30,
    //   },
    // });

    // FIND AND COUNT ALL
    // return User.findAndCountAll({ raw: true }); // returns {count , rows }

    /////// VALIDATION //////////////////////
    // const user = User.build({ email: 'richard', username: 'fooo' });
    // return user.validate();

    ///////////////////// RAW QUERIES /////////////////////////////////
    // return sequelize.query(`UPDATE users SET age = 54 WHERE user_id = 1`); // [results , metadata]

    ///////////////////// SPECIFIYING QUERY TYPE ////////////////////
    // return sequelize.query(`SELECT * from users`, {
    //   type: Sequelize.QueryTypes.SELECT,
    // }); // returns results array

    // return sequelize.query(`UPDATE users SET age = 100 WHERE user_id = 1`, {
    //   type: Sequelize.QueryTypes.UPDATE,
    // }) // returns the number of rows affected;

    // return sequelize.query(`SELECT * FROM users`, {
    //   model: User,
    // }); // returns an array of User instances with schema meta data to get the object rep use data.toJSON() on each entry

    // PREVENTING SQL INJECTION ATTACKS
    /// USING REPLACEMENTS
    // return sequelize.query(`SELECT * FROM users WHERE username = ? `, {
    //   replacements: ['Richard'],
    // });

    // return sequelize.query(
    //   `SELECT * FROM users where username LIKE :username`,
    //   {
    //     replacements: { username: '%Richard' },
    //   }
    // );

    ///// BIND PARAMETERS
    // using arrays
    // return sequelize.query(`SELECT * FROM users WHERE username LIKE $1`, {
    //   bind: ['%Richard'],
    // });

    // using objects
    return sequelize.query(
      `SELECT * FROM users WHERE username LIKE $username`,
      {
        bind: { username: '%Richard' },
      }
    );
  })
  .then((data) => {
    Array.isArray(data)
      ? data?.forEach((data) => console.log(data))
      : console.log(data?.toJSON());
  })
  .catch((err) =>
    console.log(`There was an error syncing the table user : ${err?.message}`)
  );

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log(`connection successful`);
//   })
//   .catch((err) =>
//     console.log(`Error connecting to the database ${err?.message}`)
//   );
