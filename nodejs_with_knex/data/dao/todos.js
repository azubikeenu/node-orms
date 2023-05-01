const knex = require('../db');

/**
 *
 * @param {number} id
 * @returns {Array} todos
 */
async function all() {
  return knex('todos');
}

/**
 *
 * @param {number} id
 * @returns {Object} todo
 */

async function get(id) {
  const results = await knex('todos').where({ id });
  return results[0];
}
/**
 *
 * @param {number} id
 * @returns {Object} todo
 */
async function remove(id) {
  const results = await knex('todos').where({ id }).del().returning('*');
  return results[0];
}

/**
 *
 * @param {Object} todo
 * @returns {Object} todo
 */
async function create(data) {
  const results = await knex('todos').insert(data).returning('*');
  return results[0];
}

module.exports = {
  all,
  get,
  create,
  remove,
};
