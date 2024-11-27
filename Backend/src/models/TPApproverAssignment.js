const TempratureProcessForm = require("./tempratureProcessForm");
const User = require("./users");
const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const TPApproverAssignment = sequelize.define("TPApproverAssignment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  form_id: {
    type: DataTypes.INTEGER,
    references: {
      model: TempratureProcessForm,
      key: "form_id",
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "user_id",
    },
  },
});
TempratureProcessForm.belongsToMany(User, {
  through: TPApproverAssignment,
  as: "approvers",
  foreignKey: "form_id",
});
User.belongsToMany(TempratureProcessForm, {
  through: TPApproverAssignment,
  as: "assignedApprovals1",
  foreignKey: "user_id",
});

module.exports = TPApproverAssignment;
