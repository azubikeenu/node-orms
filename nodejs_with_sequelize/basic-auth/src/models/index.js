import path from 'path';
import fs from 'fs';

const models = {};

export function registerModels(sequelize) {
  const thisFile = path.basename(__filename);
  let modelFiles = fs.readdirSync(__dirname);
  modelFiles = modelFiles.filter((file) => file !== thisFile && file.slice(-3) === '.js');
  for (let file of modelFiles) {
    const model = require(path.join(__dirname, file)).default(sequelize);
    models[model.name] = model;
  }

  // Register associations

  models.sequelize = sequelize;
}

export default models;