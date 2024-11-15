const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const BorrowingHistory = sequelize.define('BorrowingHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'books',
            key: 'id'
        }
    },
    borrower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'borrowers',
            key: 'id'
        }
    },
    checkout_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    returned_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_returned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    tableName: 'borrowing_history',
});

module.exports = BorrowingHistory;