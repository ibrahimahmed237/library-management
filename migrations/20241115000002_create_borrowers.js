exports.up = function(knex) {
  return knex.schema.createTable('borrowers', table => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('password_hash').notNullable();
    table.string('email').unique().notNullable();
    table.boolean('is_admin').notNullable().defaultTo(false);
    table.string('verification_token');
    table.boolean('is_verified').notNullable().defaultTo(false);
    table.timestamp('verification_token_expiry');
    table.timestamp('registered_at').notNullable().defaultTo(knex.fn.now());

    // Index
    table.index('email', 'borrower_email_idx');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('borrowers');
};