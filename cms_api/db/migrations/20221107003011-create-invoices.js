"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("invoices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      project_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "projects",
          key: "id",
        },
      },
      invoice_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      amount_total: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      amount_paid: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      amount_due: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("invoices");
  },
};
