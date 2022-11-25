"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuthToken extends Model {}

  AuthToken.init(
    {
      user_id: DataTypes.INTEGER,
      auth_token: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
      blacklisted: DataTypes.BOOLEAN,
      auth_token_expires_at: DataTypes.DATE,
      refresh_token_expires_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "AuthToken",
      underscored: true,
    }
  );
  return AuthToken;
};
