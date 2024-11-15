'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('books', [
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        ISBN: '9780061120084',
        description: 'A novel about the serious issues of race, class, gender, and justice in America.',
        available_quantity: 5,
        shelf_location: 'A1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '1984',
        author: 'George Orwell',
        ISBN: '9780451524935',
        description: 'A dystopian novel set in a totalitarian society ruled by Big Brother.',
        available_quantity: 3,
        shelf_location: 'B2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        ISBN: '9780743273565',
        description: 'A story of wealth, love, and the American Dream in the Roaring Twenties.',
        available_quantity: 7,
        shelf_location: 'C3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('books', null, {});
  },
};
