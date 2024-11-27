const MediaRecordProcessForm = require("./mediaRrecordForm");
const User = require("./users");
const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const MRApproverAssignment = sequelize.define("MRApproverAssignment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  form_id: {
    type: DataTypes.INTEGER,
    references: {
      model: MediaRecordProcessForm,
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
MediaRecordProcessForm.belongsToMany(User, {
  through: MRApproverAssignment,
  as: "approvers",
  foreignKey: "form_id",
});
User.belongsToMany(MediaRecordProcessForm, {
  through: MRApproverAssignment,
  as: "assignedApprovals",
  foreignKey: "user_id",
});

module.exports = MRApproverAssignment;
