const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Site = require("./sites");
const User = require("./users");

const TempratureProcessForm = sequelize.define("TempratureProcessForm", {
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
    type: DataTypes.FLOAT,
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
  reviewComment: {
    type: DataTypes.STRING,
  },
  approverComment: {
    type: DataTypes.STRING,
  },
});

TempratureProcessForm.belongsTo(Site, { foreignKey: "site_id" });
Site.hasMany(TempratureProcessForm, { foreignKey: "site_id" });

TempratureProcessForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(TempratureProcessForm, { foreignKey: "initiator_id" });

TempratureProcessForm.belongsTo(User, { foreignKey: "reviewer_id" });
User.hasMany(TempratureProcessForm, { foreignKey: "reviewer_id" });

TempratureProcessForm.belongsTo(User, { foreignKey: "approver_id" });
User.hasMany(TempratureProcessForm, { foreignKey: "approver_id" });

module.exports = TempratureProcessForm;
