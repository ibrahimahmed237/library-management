'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('borrowers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verification_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verification_token_expiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      registered_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      timestamps: false,
      underscored: true,
      tableName: 'borrowers',
      indexes: [{
        name: 'borrower_email_idx',
        unique: true,
        fields: ['email']
      }],
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('borrowers');
  }
};
