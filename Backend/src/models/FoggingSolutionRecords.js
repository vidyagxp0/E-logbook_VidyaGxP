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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nameOfArea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AHUNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ahuOffDateAndTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    volumeOfArea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foggingSolutionQty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foggingStartTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foggingEndTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    performedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ahuOnDateAndTime: {
      type: DataTypes.DATE,
      allowNull: false,
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
    remarks: {
      type: DataTypes.STRING,
    },
    supporting_docs: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
  }
);

FoggingSolutionRecords.belongsTo(FoggingSolutionForm, { foreignKey: 'form_id' });
FoggingSolutionForm.hasMany(FoggingSolutionRecords, { foreignKey: 'form_id' });

module.exports = FoggingSolutionRecords;
