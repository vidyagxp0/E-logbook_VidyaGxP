const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Site = require("./sites");
const User = require("./users");

const Equipments = sequelize.define(
  "Equipments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },    
  initiator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Site,
      key: "site_id",
    },
  },
  initiator_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_of_initiation: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
    equipmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    equipmentID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     equipmentClearance: { 
      type: DataTypes.JSON, 
      allowNull: false 
    },
     generalPrecautions: { 
      type: DataTypes.JSON, 
      allowNull: false 
    },
     manufacturingPrecautions: { 
      type: DataTypes.JSON, 
      allowNull: false 
    },
  }
);

module.exports = Equipments;
