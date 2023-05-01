const tableName = 'cart';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments('id');
    table.string('inventory');
    table.string('status');
    table.integer('user_id').index().references('id').inTable('users');
    table.integer('product_id').index().references('id').inTable('products');
    table.timestamps(false, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName);
};
