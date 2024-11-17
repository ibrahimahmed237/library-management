exports.up = function(knex) {
    return knex.schema.createTable('books', table => {
      table.increments('id');
      table.string('title').notNullable();
      table.string('author').notNullable();
      table.string('ISBN').unique().notNullable();
      table.text('description');
      table.integer('available_quantity').notNullable().defaultTo(1);
      table.string('shelf_location');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
  
      // Indexes
      table.index('author');
      table.index('title');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('books');
  };