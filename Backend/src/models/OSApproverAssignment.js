const OperationOfSterilizerProcessForm = require("./OperationOfSterilizerProcessForm");
const User = require("./users");
const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const OSApproverAssignment = sequelize.define("OSApproverAssignment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  form_id: {
    type: DataTypes.INTEGER,
    references: {
      model: OperationOfSterilizerProcessForm,
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
OperationOfSterilizerProcessForm.belongsToMany(User, {
  through: OSApproverAssignment,
  as: "approvers",
  foreignKey: "form_id",
});
User.belongsToMany(OperationOfSterilizerProcessForm, {
  through: OSApproverAssignment,
  as: "assignedApprovals",
  foreignKey: "user_id",
});

module.exports = OSApproverAssignment;
