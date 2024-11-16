'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const borrowers = [
      {
        id: 1,
        name: 'Admin User',
        password_hash: await bcrypt.hash('admin123', 10),
        email: 'admin@example.com',
        is_admin: 1,
        is_verified: 1,
        verification_token: null,
        verification_token_expiry: null,
        registered_at: new Date('2024-10-01')
      },
      {
        id: 2,
        name: 'Regular User',
        password_hash: await bcrypt.hash('user123', 10),
        email: 'user2@example.com',
        is_admin: 0,
        is_verified: 1,
        verification_token: null,
        verification_token_expiry: null,
        registered_at: new Date('2024-10-15')
      },
      {
        id: 3,
        name: 'John Doe',
        password_hash: await bcrypt.hash('john123', 10),
        email: 'john@example.com',
        is_admin: 0,
        is_verified: 1,
        verification_token: null,
        verification_token_expiry: null,
        registered_at: new Date('2024-10-20')
      },
      {
        id: 11,
        name: 'Jane Smith',
        password_hash: await bcrypt.hash('jane123', 10),
        email: 'jane@example.com',
        is_admin: 0,
        is_verified: 1,
        verification_token: null,
        verification_token_expiry: null,
        registered_at: new Date('2024-11-01')
      }
    ];

    await queryInterface.bulkInsert('borrowers', borrowers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('borrowers', null, {});
  }
};