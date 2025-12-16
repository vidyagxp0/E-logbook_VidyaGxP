const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");

const siteMaster = sequelize.define(
  "siteMaster",
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

module.exports = siteMaster;
