/***
 * belongsToMany() this adds helper methods to both models
 * addParents/Children  removeParents/Children getParents/Children
 * byDefault onDelete is set to 'CASCADE'
 *
 */

const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;

const sequelize = new Sequelize('testdb', 'admin', 'userpass', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

const Customer = sequelize.define(
  'customer',
  {
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const Product = sequelize.define(
  'product',
  {
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

Product.belongsToMany(Customer, { through: 'customer_product' });
Customer.belongsToMany(Product, { through: 'customer_product' });

//// You can also create a customModel for the join table

const CustomerProduct = sequelize.define(
  'customer_product',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);

// Product.belongsToMany(Customer, { through: CustomerProduct });
// Customer.belongsToMany(Product, { through: CustomerProduct });

let customer, product;

sequelize
  .sync({ alter: true })
  .then(() => {
    // Customer.bulkCreate([
    //   { name: 'Richard' },
    //   { name: 'Azubike' },
    //   { name: 'Anabel' },
    // ]);
    // Product.bulkCreate([
    //   { name: 'galaxy-fold' },
    //   { name: 'iphone 11' },
    //   { name: 'nokia lumia' },
    // ]);
    return Customer.findOne();
  })
  .then((data) => {
    customer = data;
    return Product.findAll();
  })
  .then((data) => {
    product = data;
    return customer.addProducts(product);
  })
  .catch((err) => {
    console.log(err?.message);
  });
