const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Site = require("./sites");
const User = require("./users");

const LoadedQuantityProcessForm = sequelize.define(
  "LoadedQuantityProcessForm",
  {
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
      type: DataTypes.JSON,
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
    additionalAttachment: {
      type: DataTypes.STRING,
    },
    additionalInfo: {
      type: DataTypes.STRING,
    },
  }
);

LoadedQuantityProcessForm.belongsTo(Site, { foreignKey: "site_id" });
Site.hasMany(LoadedQuantityProcessForm, { foreignKey: "site_id" });

LoadedQuantityProcessForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(LoadedQuantityProcessForm, { foreignKey: "initiator_id" });

LoadedQuantityProcessForm.belongsTo(User, {
  foreignKey: "reviewer_id",
  as: "reviewer1",
});
User.hasMany(LoadedQuantityProcessForm, {
  foreignKey: "reviewer_id",
  as: "reviewer1",
});

LoadedQuantityProcessForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver1",
});
User.hasMany(LoadedQuantityProcessForm, {
  foreignKey: "approver_id",
  as: "approver1",
});

module.exports = LoadedQuantityProcessForm;
