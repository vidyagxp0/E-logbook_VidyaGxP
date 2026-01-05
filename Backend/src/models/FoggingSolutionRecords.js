const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const FoggingSolutionForm = require("./FoggingSolutionForm")

const FoggingSolutionRecords = sequelize.define(
  "FoggingSolutionRecords",
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
        model: FoggingSolutionForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fogging_solution: {
      type: DataTypes.FLOAT,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    approver_remarks: {
      type: DataTypes.STRING,
    },
    checked_by: {
      type: DataTypes.STRING,
    },
    reviewed_by: {
      type: DataTypes.STRING,
    },
    approved_by: {
      type: DataTypes.STRING,
    },
    supporting_docs: {
      type: DataTypes.STRING,
    },
  }
);

FoggingSolutionRecords.belongsTo(FoggingSolutionForm, { foreignKey: 'form_id' });
FoggingSolutionForm.hasMany(FoggingSolutionRecords, { foreignKey: 'form_id' });

module.exports = FoggingSolutionRecords;
