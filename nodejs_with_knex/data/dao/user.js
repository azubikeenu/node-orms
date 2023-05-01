const knex = require('../db');

const tableName = 'users';
/**
 *
 * @param {number} id
 * @returns {Array} user
 */
async function all() {
  return knex(tableName);
}

/**
 *
 * @param {number} id
 * @returns {Object} user
 */

async function get(id) {
  const results = await knex(tableName).where({ id });
  return results[0];
}
/**
 *
 * @param {number} id
 * @returns {Object} user
 */
async function remove(id) {
  const results = await knex(tableName).where({ id }).del().returning('*');
  return results[0];
}

/**
 *
 * @param {Object} user
 * @returns {Object} user
 */
async function create(data) {
  const results = await knex(tableName).insert(data).returning('*');
  return results[0];
}

async function getByEmailAndPassword(email, password) {
  const results = await knex(tableName).where({ email, password });
  return results[0];
}

async function getByEmail(email) {
  const results = await knex(tableName).where({ email });
  return results[0];
}

async function updateById(id, payload) {
  const results = await knex(tableName)
    .where({ id })
    .update({ payload })
    .returning('*');
  return results[0];
}

module.exports = {
  all,
  get,
  create,
  remove,
  getByEmailAndPassword,
  getByEmail,
  updateById,
};
