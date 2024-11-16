const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const LoadedQuantityProcessForm = require("./loadedQuantityProcessForm");

const LoadedQuantityProcessAuditTrail = sequelize.define(
  "LoadedQuantityProcessAuditTrail",
  {
    auditTrail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: LoadedQuantityProcessForm,
        key: "form_id",
      },
    },
    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    field_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    previous_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    new_value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    previous_status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    new_status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    declaration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
);

LoadedQuantityProcessAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(LoadedQuantityProcessAuditTrail, { foreignKey: "changed_by" });

LoadedQuantityProcessAuditTrail.belongsTo(LoadedQuantityProcessForm, {
  foreignKey: "form_id",
});
LoadedQuantityProcessForm.hasMany(LoadedQuantityProcessAuditTrail, {
  foreignKey: "form_id",
});

module.exports = LoadedQuantityProcessAuditTrail;
