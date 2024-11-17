const { DataTypes } = require("sequelize");
const sequelize = require("../../../shared/db.js");

const Borrower = sequelize.define("Borrowers", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    verification_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    verification_token_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    registered_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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

module.exports = Borrower;
