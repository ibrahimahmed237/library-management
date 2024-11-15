'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcryptjs = require('bcryptjs'); 
module.exports = {
  async up(queryInterface, Sequelize) {
    // Define password hashing rounds
    const saltRounds = 10;

    // Seed data
    const borrowers = [
      {
        name: 'John Doe',
        password_hash: await bcryptjs.hash('password123', saltRounds),
        email: 'john.doe@example.com',
        is_admin: false,
        verification_token: null,
        is_verified: true,
        verification_token_expiry: null,
        registered_at: new Date(),
      },
      {
        name: 'Jane Smith',
        password_hash: await bcryptjs.hash('securepass456', saltRounds),
        email: 'jane.smith@example.com',
        is_admin: false,
        verification_token: '1234567890abcdef',
        is_verified: false,
        verification_token_expiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        registered_at: new Date(),
      },
      {
        name: 'Alice Johnson',
        password_hash: await bcryptjs.hash('mypassword789', saltRounds),
        email: 'alice.johnson@example.com',
        verification_token: null,
        is_admin: false,
        is_verified: true,
        verification_token_expiry: null,
        registered_at: new Date(),
      },
      {
        name: 'Admin User',
        password_hash: await bcryptjs.hash('adminPassword123', saltRounds),
        email: 'admin@example.com',
        is_admin: true, 
        verification_token: null,
        is_verified: true,
        verification_token_expiry: null,
        registered_at: new Date(),
      },
    ];

    // Insert the seed data
    await queryInterface.bulkInsert('borrowers', borrowers, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove all seeded data
    await queryInterface.bulkDelete('borrowers', null, {});
  },
};
