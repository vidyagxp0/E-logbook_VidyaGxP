const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");

const personInvolved = sequelize.define(
  "personInvolved",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,

    },
     personInvolvedData: { 
      type: DataTypes.JSON, 
      allowNull: false 
    },
  }
);

module.exports = personInvolved;
