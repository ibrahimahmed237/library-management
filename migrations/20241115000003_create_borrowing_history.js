exports.up = function (knex) {
  return knex.schema.createTable('borrowing_history', table => {
    table.increments('id');
    table.integer('book_id').unsigned().references('id').inTable('books');
    table.integer('borrower_id').unsigned().references('id').inTable('borrowers');
    table.timestamp('checkout_date').notNullable();
    table.timestamp('return_date').notNullable();
    table.timestamp('returned_date');
    table.boolean('is_returned').notNullable().defaultTo(false);
    // Indexes
    table.index('book_id');
    table.index('borrower_id');
    table.index('checkout_date');
    table.index('returned_date');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('borrowing_history');
};