const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const DifferentialPressureForm = sequelize.define("DifferentialPressureForm", {
  form_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  initiator: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_of_initiation: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  short_description: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  department: {
    type: DataTypes.STRING,
  },
  compression_area: {
    type: DataTypes.STRING,
  },
  limit: {
    type: DataTypes.INTEGER,
  },
  month: {
    type: DataTypes.STRING,
  },
  reviewer: {
    type: DataTypes.STRING,
  },
  approver: {
    type: DataTypes.STRING,
  },
  review_comments: {
    type: DataTypes.STRING,
  },
});

module.exports = DifferentialPressureForm;
