const TempratureProcessForm = require("./tempratureProcessForm");
const User = require("./users");
const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const TPReviewerAssignment = sequelize.define("TPReviewerAssignment", {
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
  through: TPReviewerAssignment,
  as: "reviewers",
  foreignKey: "form_id",
});
User.belongsToMany(TempratureProcessForm, {
  through: TPReviewerAssignment,
  as: "assignedReviews",
  foreignKey: "user_id",
});

module.exports = TPReviewerAssignment;
