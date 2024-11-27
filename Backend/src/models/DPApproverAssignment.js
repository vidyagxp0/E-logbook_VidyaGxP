const DifferentialPressureForm = require("./differentialPressureForm");
const User = require("./users");
const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const DPApproverAssignment = sequelize.define("DPApproverAssignment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  form_id: {
    type: DataTypes.INTEGER,
    references: {
      model: DifferentialPressureForm,
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
DifferentialPressureForm.belongsToMany(User, {
  through: DPApproverAssignment,
  as: "approvers",
  foreignKey: "form_id",
});
User.belongsToMany(DifferentialPressureForm, {
  through: DPApproverAssignment,
  as: "assignedApprovals",
  foreignKey: "user_id",
});

module.exports = DPApproverAssignment;
