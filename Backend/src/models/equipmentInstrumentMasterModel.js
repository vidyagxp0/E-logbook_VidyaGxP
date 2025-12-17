const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");

const equipmentInstrumentMaster = sequelize.define(
  "equipmentInstrumentMaster",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
     equipmentInstrumentData: {
      type: DataTypes.JSON, 
      allowNull: false 
    },
  }
);

module.exports = equipmentInstrumentMaster;
