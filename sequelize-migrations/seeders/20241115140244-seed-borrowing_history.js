'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed data for borrowing history
    const borrowingHistory = [
      {
        book_id: 1,
        borrower_id: 1,
        checkout_date: new Date('2024-11-01'),
        return_date: new Date('2024-11-15'),
        returned_date: new Date('2024-11-14'),
        is_returned: true,
      },
      {
        book_id: 2,
        borrower_id: 2,
        checkout_date: new Date('2024-11-05'),
        return_date: new Date('2024-11-20'),
        returned_date: null,
        is_returned: false,
      },
      {
        book_id: 3,
        borrower_id: 3,
        checkout_date: new Date('2024-11-10'),
        return_date: new Date('2024-11-25'),
        returned_date: null,
        is_returned: false,
      },
    ];

    // Insert the seed data into the borrowing_history table
    await queryInterface.bulkInsert('borrowing_history', borrowingHistory, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove all seeded data from the borrowing_history table
    await queryInterface.bulkDelete('borrowing_history', null, {});
  },
};
