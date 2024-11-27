const DispenseOfMaterialForm = require("./dispensingOfMaterialForm");
const User = require("./users");
const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const DMApproverAssignment = sequelize.define("DMApproverAssignment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  form_id: {
    type: DataTypes.INTEGER,
    references: {
      model: DispenseOfMaterialForm,
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
DispenseOfMaterialForm.belongsToMany(User, {
  through: DMApproverAssignment,
  as: "approvers",
  foreignKey: "form_id",
});
User.belongsToMany(DispenseOfMaterialForm, {
  through: DMApproverAssignment,
  as: "assignedApprovals",
  foreignKey: "user_id",
});

module.exports = DMApproverAssignment;
