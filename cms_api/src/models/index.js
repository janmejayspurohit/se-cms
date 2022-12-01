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

Project.belongsTo(User, {
  foreignKey: "project_manager",
  as: "manager",
});

Project.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
});

Meeting.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project",
});

Bug.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project",
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
