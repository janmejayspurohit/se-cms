"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("auth_tokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          key: "id",
          model: "users",
        },
        onDelete: "CASCADE",
      },
      auth_token: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      refresh_token: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      blacklisted: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      auth_token_expires_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      refresh_token_expires_at: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("auth_tokens");
  },
};
