const Sequelize = require('sequelize');

'use strict';
module.exports = (sequelize, DataTypes) => {
    class Book extends Sequelize.Model {
      
    }
    Book.init(
      {
          title: {
              type: DataTypes.STRING,
              allowNull: false,
              validate: {
                  notEmpty: {
                      msg: 'Please provide a value for "title"',
                  },
              },
          },
          author: {
              type: DataTypes.STRING,
              allowNull: false,
              validate: {
                  notEmpty: {
                      msg: 'Please provide a value for "author"',
                  },
              },
          },
          genre: DataTypes.STRING,
          year: DataTypes.INTEGER,
      },
      {
          sequelize,
          modelName: "Book",
      }
  );
  return Book;
};