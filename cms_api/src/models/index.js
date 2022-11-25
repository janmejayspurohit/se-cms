const { AuthToken, User, Bug, Customer, Invoice, Meeting, Project, Tech } = require("../../db/models");

// User Associations
User.auth_tokens = User.hasMany(AuthToken, {
  foreignKey: "user_id",
  as: "auth_tokens",
});

// AuthToken Associations
AuthToken.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

module.exports = {
  AuthToken,
  User,
  Bug,
  Customer,
  Invoice,
  Meeting,
  Project,
  Tech,
};
