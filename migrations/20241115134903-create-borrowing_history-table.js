'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('borrowing_history', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'id'
        }
      },
      borrower_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'borrowers',
          key: 'id'
        }
      },
      checkout_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      return_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      returned_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      is_returned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

    },{
      indexes: [
      {
        fields: ['checkout_date']
      },
      {
        fields: ['return_date']
      },
      {
        fields: ['borrower_id']
      },
      {
        fields: ['book_id']
      }
      
    ],
  }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('borrowing_history');
  }
};
