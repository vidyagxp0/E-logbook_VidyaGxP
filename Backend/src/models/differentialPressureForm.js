const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Site = require("./sites");
const User = require("./users");

const DifferentialPressureForm = sequelize.define("DifferentialPressureForm", {
  form_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Site,
      key: "site_id",
    },
  },
  initiator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
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
  description: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stage: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
  },
  compression_area: {
    type: DataTypes.STRING,
  },
  limit: {
    type: DataTypes.INTEGER,
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  approver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  review_comments: {
    type: DataTypes.STRING,
  },
});

DifferentialPressureForm.belongsTo(Site, { foreignKey: "site_id" });
Site.hasMany(DifferentialPressureForm, { foreignKey: "site_id" });

DifferentialPressureForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(DifferentialPressureForm, { foreignKey: "initiator_id" });

DifferentialPressureForm.belongsTo(User, { foreignKey: "reviewer_id" });
User.hasMany(DifferentialPressureForm, { foreignKey: "reviewer_id" });

DifferentialPressureForm.belongsTo(User, { foreignKey: "approver_id" });
User.hasMany(DifferentialPressureForm, { foreignKey: "approver_id" });

module.exports = DifferentialPressureForm;
