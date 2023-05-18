/***
 * Standard assocations in Sequelize include the following
 * hasOne ==> oneToOneRelationShip , it is usually applied on the parent table ie Parent.hasOne(Child)
 * // using hasOne adds helper methods to the parent element
 *  for hasOne == getChild , setChild createChild
 *
 * belongsTo ==> this is a relationship applied on the child table , ie where the foriegn key resides
 * at adds helper methods to act on the parent getParent setParent
 *
 * to include a child model
 *  Model.findOne({where : {email}},include : ChildModel)
 *
 */

const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;

const sequelize = new Sequelize('testdb', 'admin', 'userpass', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

const Country = sequelize.define(
  'country',
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

const Capital = sequelize.define('capital', {
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
});

Country.hasOne(Capital, {
  foreignKey: {
    name: 'country_id',
    type: DataTypes.INTEGER,
  },
  onDelete: 'CASCADE',
});

Capital.belongsTo(Country);

let country, capital;

sequelize
  .sync({ alter: true })
  .then(() => {
    // working with the upated table

    // Country.bulkCreate([
    //   { name: 'Nigeria' },
    //   { name: 'Ghana' },
    //   { name: 'Togo' },
    //   { name: 'Cameroun' },
    //   { name: 'Dahomey' },
    // ]);

    // Capital.bulkCreate([
    //   { name: 'abuja' },
    //   { name: 'accra' },
    //   { name: 'lome' },
    //   { name: 'yaounde' },
    //   { name: 'port-novo' },
    // ]);

    return Capital.findOne({ where: { name: 'abuja' } });
  })
  .then((data) => {
    capital = data;
    return Country.findOne({ where: { name: 'Nigeria' } });
  })
  .then((data) => {
    country = data;
    country.setCapital(capital);
    return Country.findOne({ where: { name: country?.name } });
  })
  .then((data) => {
    return data.getCapital();
  })
  .then((data) => {
    console.log(data?.toJSON());
    return Country.findOne({ where: { name: country?.name } });
  })
  .then((data) => {
    // data.createCapital({
    //   name: 'lagos',
    // });
  })
  .catch((err) => {
    console.log(err?.message);
  });
