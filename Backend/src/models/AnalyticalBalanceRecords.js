const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const AnalyticalBalanceProcessForm = require("./AnalyticalBalanceForm")

const AnalyticalBalance = sequelize.define(
  "AnalyticalBalance",
  {
    record_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AnalyticalBalanceProcessForm,
        key: "form_id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reg_no: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
     sample_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    weight_taken: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    done_by: { 
      type: DataTypes.STRING
     },
    supporting_docs: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checked_by: {
       type: DataTypes.STRING
       },
    reviewed_by: {
      type: DataTypes.STRING,
    },
    remarks: { 
      type: DataTypes.STRING 
    },
    remarksOther: {
      type: DataTypes.STRING,
    },
    remarksType: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING
    }
  }
);

AnalyticalBalance.belongsTo(AnalyticalBalanceProcessForm, { foreignKey: 'form_id' });
AnalyticalBalanceProcessForm.hasMany(AnalyticalBalance, { foreignKey: 'form_id' });

module.exports = AnalyticalBalance;
