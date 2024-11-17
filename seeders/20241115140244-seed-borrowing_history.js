'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const borrowingHistory = [
      {
        id: 1,
        book_id: 1,
        borrower_id: 1,
        checkout_date: new Date('2024-11-01'),
        return_date: new Date('2024-11-15'),
        returned_date: new Date('2024-11-14'),
        is_returned: true,
      },
      {
        id: 2,
        book_id: 2,
        borrower_id: 2,
        checkout_date: new Date('2024-11-05'),
        return_date: new Date('2024-11-20'),
        returned_date: null,
        is_returned: false,
      },
      {
        id: 3,
        book_id: 3,
        borrower_id: 3,
        checkout_date: new Date('2024-11-10'),
        return_date: new Date('2024-11-25'),
        returned_date: null,
        is_returned: false,
      },
      {
        id: 4,
        book_id: 1,
        borrower_id: 11,
        checkout_date: new Date('2024-11-16 12:12:53'),
        return_date: new Date('2024-11-18'),
        returned_date: new Date('2024-11-16 12:13:47'),
        is_returned: true,
      },
      {
        id: 5,
        book_id: 1,
        borrower_id: 11,
        checkout_date: new Date('2024-11-16 12:16:10'),
        return_date: new Date('2024-11-18'),
        returned_date: null,
        is_returned: false,
      },
      {
        id: 6,
        book_id: 2,
        borrower_id: 11,
        checkout_date: new Date('2024-11-16 12:16:24'),
        return_date: new Date('2024-11-15'),
        returned_date: null,
        is_returned: false,
      },
      {
        id: 7,
        book_id: 2,
        borrower_id: 3,
        checkout_date: new Date('2024-11-16 12:19:05'),
        return_date: new Date('2024-11-18'),
        returned_date: new Date('2024-11-16 12:19:38'),
        is_returned: true,
      },
      {
        id: 8,
        book_id: 4,
        borrower_id: 3,
        checkout_date: new Date('2024-11-16 12:20:07'),
        return_date: new Date('2024-11-18'),
        returned_date: new Date('2024-11-16 12:20:17'),
        is_returned: true,
      },
      {
        id: 9,
        book_id: 3,
        borrower_id: 11,
        checkout_date: new Date('2024-11-16 12:44:06'),
        return_date: new Date('2024-11-18'),
        returned_date: null,
        is_returned: false,
      },
      {
        id: 10,
        book_id: 4,
        borrower_id: 11,
        checkout_date: new Date('2024-11-16 12:44:10'),
        return_date: new Date('2024-11-18'),
        returned_date: null,
        is_returned: false,
      },
    ];

    await queryInterface.bulkInsert('borrowing_history', borrowingHistory, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('borrowing_history', null, {});
  },
};