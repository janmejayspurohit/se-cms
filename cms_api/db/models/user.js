"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static ROLES = {
      USER: "USER",
      ADMIN: "ADMIN",
    };
    static GENDERS = {
      MALE: "MALE",
      FEMALE: "FEMALE",
      OTHERS: "OTHERS",
    };
    static STATUSES = {
      ACTIVE: "ACTIVE",
      DELETED: "DELETED",
      SUSPENDED: "SUSPENDED",
    };
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: { type: DataTypes.ENUM, values: ["MALE", "FEMALE", "OTHERS"], allowNull: true },
      country_code: DataTypes.STRING,
      phone_number: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      encrypted_password: DataTypes.STRING,
      status: { type: DataTypes.ENUM, values: ["ACTIVE", "DELETED", "SUSPENDED"], defaultValue: "ACTIVE" },
      role: { type: DataTypes.ENUM, values: ["USER", "ADMIN"], defaultValue: "USER" },
    },
    {
      defaultScope: {
        attributes: {
          exclude: ["encrypted_password"],
        },
      },
      sequelize,
      modelName: "User",
      underscored: true,
    }
  );
  return User;
};
