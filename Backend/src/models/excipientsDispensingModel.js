const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");

const excipientsDispensing = sequelize.define(
  "excipientsDispensing",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,

    },
     excipientsDispensingData: { 
      type: DataTypes.JSON, 
      allowNull: false 
    },
  }
);

module.exports = excipientsDispensing;
