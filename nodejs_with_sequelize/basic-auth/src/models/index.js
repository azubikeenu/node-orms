import path from 'path';
import fs from 'fs';

const models = {};

export function registerModels(sequelize) {
  const thisFile = path.basename(__filename);
  let modelFiles = fs.readdirSync(__dirname);
  modelFiles = modelFiles.filter((file) => file !== thisFile && file.slice(-3) === '.js');
  for (let file of modelFiles) {
    // the default object returns a function which on invocation returns the model instance
    const model = require(path.join(__dirname, file)).default(sequelize);
    // model.name is retreived from modelName attribute, set during schema initialization
    models[model.name] = model;
  }

  // Register associations
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  models.sequelize = sequelize;
}

export default models;
