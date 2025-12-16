const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");

const identificationMaster = sequelize.define(
  "identificationMaster",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,

    },
     siteMasterData: { 
      type: DataTypes.JSON, 
      allowNull: false 
    },
  }
);

module.exports = identificationMaster;
