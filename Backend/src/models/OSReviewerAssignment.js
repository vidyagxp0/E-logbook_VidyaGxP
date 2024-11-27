const OperationOfSterilizerProcessForm = require("./OperationOfSterilizerProcessForm");
const User = require("./users");
const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const OSReviewerAssignment = sequelize.define("OSReviewerAssignment", {
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
  through: OSReviewerAssignment,
  as: "reviewers",
  foreignKey: "form_id",
});
User.belongsToMany(OperationOfSterilizerProcessForm, {
  through: OSReviewerAssignment,
  as: "assignedReviews",
  foreignKey: "user_id",
});

module.exports = OSReviewerAssignment;
