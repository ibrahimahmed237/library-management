'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const books = [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        ISBN: '9780743273565',
        description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
        available_quantity: 2,
        shelf_location: 'A1-01',
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-10-01')
      },
      {
        id: 2,
        title: '1984',
        author: 'George Orwell',
        ISBN: '9780451524935',
        description: 'A dystopian social science fiction novel and cautionary tale.',
        available_quantity: 3,
        shelf_location: 'A1-02',
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-10-01')
      },
      {
        id: 3,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        ISBN: '9780446310789',
        description: 'The story of racial injustice and the loss of innocence in the American South.',
        available_quantity: 2,
        shelf_location: 'A1-03',
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-10-01')
      },
      {
        id: 4,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        ISBN: '9780141439518',
        description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet.',
        available_quantity: 2,
        shelf_location: 'A1-04',
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-10-01')
      }
    ];

    await queryInterface.bulkInsert('books', books, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('books', null, {});
  }
};