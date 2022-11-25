"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customer_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "customers",
          key: "id",
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      requirements: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      project_manager: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
          as: "project_manager",
        },
      },
      assigned_engineers: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      timeline: {
        allowNull: false,
        type: Sequelize.JSONB,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM("CREATED", "STARTED", "IN_PROGRESS", "COMPLETED", "DROPPED"),
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
    await queryInterface.dropTable("projects");
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS enum_projects_status;");
  },
};
