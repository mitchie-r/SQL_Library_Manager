const Sequelize = require('sequelize');

'use strict';
module.exports = (sequelize) => {
    class Book extends Sequelize.Model {
      
    }
    Book.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false, 
            validate: {
              notEmpty: {
                msg: 'Please provide a value for "title"'
              }
             }
          },
          author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              notEmpty: {
                msg: 'Please provide a value for "author"'
              }
             }
          },
          genre: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          year: {
            type: Sequelize.INTEGER,
            allowNull: true, 
          }
       }, { sequelize })
    return Book;
}