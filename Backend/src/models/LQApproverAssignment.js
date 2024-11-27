const LoadedQuantityProcessForm = require("./loadedQuantityProcessForm");
const User = require("./users");
const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const LQApproverAssignment = sequelize.define("LQApproverAssignment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  form_id: {
    type: DataTypes.INTEGER,
    references: {
      model: LoadedQuantityProcessForm,
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
LoadedQuantityProcessForm.belongsToMany(User, {
  through: LQApproverAssignment,
  as: "approvers",
  foreignKey: "form_id",
});
User.belongsToMany(LoadedQuantityProcessForm, {
  through: LQApproverAssignment,
  as: "assignedApprovals",
  foreignKey: "user_id",
});

module.exports = LQApproverAssignment;
