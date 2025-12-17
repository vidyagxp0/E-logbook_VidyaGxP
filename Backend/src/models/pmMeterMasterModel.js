const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");

const pmMeterMaster = sequelize.define(
  "pmMeterMaster",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,

    },
     pmMeterMasterData: { 
      type: DataTypes.JSON, 
      allowNull: false 
    },
  }
);

module.exports = pmMeterMaster;
