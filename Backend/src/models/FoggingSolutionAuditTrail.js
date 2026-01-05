const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const FoggingSolutionForm = require("./FoggingSolutionForm");

const FoggingSolutionAuditTrail = sequelize.define(
  "FoggingSolutionAuditTrail",
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
        model: FoggingSolutionForm,
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
      allowNull: false,
    },
    new_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    declaration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

FoggingSolutionAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(FoggingSolutionAuditTrail, { foreignKey: "changed_by" });

FoggingSolutionAuditTrail.belongsTo(FoggingSolutionForm, {
  foreignKey: "form_id",
});
FoggingSolutionForm.hasMany(FoggingSolutionAuditTrail, {
  foreignKey: "form_id",
});

module.exports = FoggingSolutionAuditTrail;
