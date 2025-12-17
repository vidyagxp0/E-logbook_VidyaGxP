const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");

const connectedElogbookMaster = sequelize.define(
  "connectedElogbookMaster",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,

    },
     connectedElogbookData: { 
      type: DataTypes.JSON, 
      allowNull: false 
    },
  }
);

module.exports = connectedElogbookMaster;
