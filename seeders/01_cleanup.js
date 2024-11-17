exports.seed = async function(knex) {
    // Disable foreign key checks
    await knex.raw('SET FOREIGN_KEY_CHECKS=0');
    
    // Clean all tables
    await knex('borrowing_history').truncate();
    await knex('books').truncate();
    await knex('borrowers').truncate();
    
    // Re-enable foreign key checks
    await knex.raw('SET FOREIGN_KEY_CHECKS=1');
  };
  