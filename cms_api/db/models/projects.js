"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static STATUSES = {
      CREATED: "CREATED",
      STARTED: "STARTED",
      IN_PROGRESS: "IN_PROGRESS",
      COMPLETED: "COMPLETED",
      DROPPED: "DROPPED",
    };
  }
  Project.init(
    {
      customer_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "customers",
          key: "id",
        },
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      requirements: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      project_manager: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
          as: "project_manager",
        },
      },
      assigned_engineers: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        references: {
          model: "users",
          key: "id",
          as: "assigned_engineers",
        },
      },
      timeline: {
        allowNull: false,
        type: DataTypes.JSONB,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM("CREATED", "STARTED", "IN_PROGRESS", "COMPLETED", "DROPPED"),
      },
    },
    {
      sequelize,
      modelName: "Project",
      underscored: true,
    }
  );
  return Project;
};
