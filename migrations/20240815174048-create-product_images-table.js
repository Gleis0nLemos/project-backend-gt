'use strict';

const product = require('../models/product');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('product_images', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey:  true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('product_images');
  }
};
