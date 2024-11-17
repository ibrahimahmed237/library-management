const { DataTypes } = require("sequelize");
const sequelize = require("../../../shared/db.js");

const Book = sequelize.define("Books", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ISBN: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  available_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  shelf_location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
},
  {
    tableName: 'books',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['ISBN']
      },
      {
        fields: ['author']
      },
      {
        fields: ['title']
      }
    ]
  }
);

module.exports = Book;
