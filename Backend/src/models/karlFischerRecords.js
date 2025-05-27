const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const karlFischerForm = require("./karlFischerForm");

const karlFischerRecord = sequelize.define(
  "karlFischerRecord",
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
        model: karlFischerForm,
        key: 'form_id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    lot_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sample_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    factor_percent_water: {
      type: DataTypes.STRING,
    },
    done_by: {
      type: DataTypes.STRING,
    },
    checked_by: {
      type: DataTypes.STRING,
    },
    reviewed_by: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
  }
);

// Associations
karlFischerRecord.belongsTo(karlFischerForm, { foreignKey: 'form_id' });
karlFischerForm.hasMany(karlFischerRecord, { foreignKey: 'form_id' });

module.exports = karlFischerRecord;
