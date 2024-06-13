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
  date_of_review: {
    type: DataTypes.DATE,
  },
  date_of_approval: {
    type: DataTypes.DATE,
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
  initiatorComment: {
    type: DataTypes.STRING,
  },
  initiatorAttachment: {
    type: DataTypes.STRING,
  },
  reviewerAttachment: {
    type: DataTypes.STRING,
  },
  approverAttachment: {
    type: DataTypes.STRING,
  },
  initiatorDeclaration: {
    type: DataTypes.STRING,
  },
  reviewerDeclaration: {
    type: DataTypes.STRING,
  },
  approverDeclaration: {
    type: DataTypes.STRING,
  },

});

DifferentialPressureForm.belongsTo(Site, { foreignKey: "site_id" });
Site.hasMany(DifferentialPressureForm, { foreignKey: "site_id" });

DifferentialPressureForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(DifferentialPressureForm, { foreignKey: "initiator_id" });

DifferentialPressureForm.belongsTo(User, { foreignKey: "reviewer_id", as: 'reviewer' });
User.hasMany(DifferentialPressureForm, { foreignKey: "reviewer_id", as: 'reviewer' });

DifferentialPressureForm.belongsTo(User, { foreignKey: "approver_id", as: 'approver' });
User.hasMany(DifferentialPressureForm, { foreignKey: "approver_id", as: 'approver' });

module.exports = DifferentialPressureForm;
