const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const LoadedQuantityProcessForm = require("./loadedQuantityProcessForm")

const LoadedQuantityRecord = sequelize.define(
  "LoadedQuantityRecord",
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
        model: LoadedQuantityProcessForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING,
    },
    batch_no: {
      type: DataTypes.STRING,
    },
    container_size: {
      type: DataTypes.STRING,
    },
    batch_size: {
      type: DataTypes.STRING,
    },
    theoretical_production: {
      type: DataTypes.STRING,
    },
    loaded_quantity: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    checked_by: {
      type: DataTypes.STRING,
    },
    reviewed_by: {
      type: DataTypes.STRING,
    },
    yield: {
      type: DataTypes.STRING,
    },
  }
);

LoadedQuantityRecord.belongsTo(LoadedQuantityProcessForm, { foreignKey: 'form_id' });
LoadedQuantityProcessForm.hasMany(LoadedQuantityRecord, { foreignKey: 'form_id' });

module.exports = LoadedQuantityRecord;
