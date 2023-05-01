const knex = require('../db');

const tableName = 'products';
/**
 *
 * @param {number} id
 * @returns {Array} product
 */
async function all() {
  return knex(tableName);
}

/**
 *
 * @param {number} id
 * @returns {Object} product
 */

async function get(id) {
  const results = await knex(tableName).where({ id });
  return results[0];
}
/**
 *
 * @param {number} id
 * @returns {Object} product
 */
async function remove(id) {
  const results = await knex(tableName).where({ id }).del().returning('*');
  return results[0];
}

/**
 *
 * @param {Object} user
 * @returns {Object} product
 */
async function create(data) {
  const results = await knex(tableName).insert(data).returning('*');
  return results[0];
}

module.exports = {
  all,
  get,
  create,
  remove,
};
