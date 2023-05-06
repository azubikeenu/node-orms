/**
 *
 * manyToMany relationShip hasMany
 * on the parent side you get a helper method addChild() , countChild() , removeChild()
 * on the child side you get a helper method getParent(), setParent() , createParent()
 *
 */

const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;

const sequelize = new Sequelize('testdb', 'admin', 'userpass', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

const User = sequelize.define(
  'user',
  {
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const Post = sequelize.define(
  'post',
  {
    message: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

User.hasMany(Post, { onDelete: 'CASCADE' });
Post.belongsTo(User);

let user, posts;
sequelize
  .sync({ alter: true })
  .then(() => {
    // User.bulkCreate([
    //   {
    //     name: 'Richard',
    //   },
    //   {
    //     name: 'Azubike',
    //   },
    //   {
    //     name: 'Godson',
    //   },
    //   {
    //     name: 'Anabel',
    //   },
    // ]);

    // Post.bulkCreate([
    //   {
    //     message: 'This is a dummy message',
    //   },
    //   {
    //     message: 'This is a dummy message',
    //   },
    //   {
    //     message: 'This is a dummy message',
    //   },
    //   {
    //     message: 'This is a dummy message',
    //   },
    // ]);

    return User.findOne({});
  })
  .then((data) => {
    user = data;
    return Post.findAll();
  })
  .then((data) => {
    posts = data;
    // this sets the foriegn key of all posts to the given user ;
    user.addPosts(posts);
    return User.findOne({});
  })
  .then((data) => {
    user = data;
    // this returns the count of all the posts associated to the user
    return user.countPosts();
  })
  .then((data) => {
    console.log(data);
    return Post.findOne();
  })
  .then((data) => {
    // this removes a post from the user
    return user.removePost(data);
  })
  .catch((err) => {
    console.log(err?.message);
  });
