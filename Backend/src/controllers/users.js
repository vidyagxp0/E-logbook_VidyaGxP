const User = require("../models/users");
const UserRole = require("../models/userRoles");
const config = require("../config/config.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Role = require("../models/roles");
const Process = require("../models/processes");
const Site = require("../models/sites");
const RoleGroup = require("../models/roleGroups");
const { sequelize } = require("../config/db");

//register user
exports.signup = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "User already registered!!",
      });
    }

    // Check if password is provided
    if (!req.body.password) {
      return res.status(400).json({
        error: true,
        message: "Please provide a password!",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(req.body.password, salt);

    // Create the user
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashpass,
      age: req.body.age,
      gender: req.body.gender,
    });

    // Process roles array
    const rolesArray = req.body.rolesArray;
    for (const role of rolesArray) {
      const singleRole = role.label.split("-");
      const roleId = await Role.findOne({ where: { role: singleRole[2] } });
      const roleGroup = await RoleGroup.findOne({
        where: { roleGroup: role.label },
      });
      const processId = await Process.findOne({
        where: { process: singleRole[1] },
      });
      const siteId = await Site.findOne({ where: { site: singleRole[0] } });

      await UserRole.create({
        user_id: newUser.user_id,
        site_id: siteId.site_id,
        process_id: processId.process_id,
        role_id: roleId.role_id,
        roleGroup_id: roleGroup.roleGroup_id,
      });
    }

    // Send success response after all roles are processed
    return res.status(200).json({
      error: false,
      message: "User Registered",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(400).json({
      error: true,
      message: `Error during registration: ${error.message}`,
    });
  }
};

//Update user
exports.editUser = async (req, res) => {
  try {
    // Check if request body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: true,
        message: "Please provide details to update!",
      });
    }

    // Update user details
    const userdetails = {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      gender: req.body.gender,
    };
    await User.update(userdetails, {
      where: { user_id: req.params.id },
    });

    // Delete existing UserRole entries
    await UserRole.destroy({
      where: { user_id: req.params.id },
    });

    // Process roles array sequentially
    const rolesArray = req.body.rolesArray;
    for (const role of rolesArray) {
      const singleRole = role.label.split("-");
      const roleId = await Role.findOne({
        where: { role: singleRole[2] },
      });
      const processId = await Process.findOne({
        where: { process: singleRole[1] },
      });
      const siteId = await Site.findOne({
        where: { site: singleRole[0] },
      });
      const roleGroup = await RoleGroup.findOne({
        where: { roleGroup: role.label },
      });

      await UserRole.create({
        user_id: req.params.id,
        site_id: siteId.site_id,
        process_id: processId.process_id,
        role_id: roleId.role_id,
        roleGroup_id: roleGroup.roleGroup_id,
      });
    }

    // Send success response after all roles are processed
    return res.status(200).json({
      error: false,
      message: "User Details Updated",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(400).json({
      error: true,
      message: `Error during update: ${error.message}`,
    });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne(
      { where: { user_id: req.params.id } },
      { transaction }
    );
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    await UserRole.destroy(
      { where: { user_id: req.params.id } },
      { transaction }
    );

    await User.destroy({ where: { user_id: req.params.id } }, { transaction });
    await transaction.commit();
    res.json({
      error: false,
      message: "User deleted successfully",
    });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

//get all users
exports.getAllUsers = async (req, res) => {
  User.findAll()
    .then((result) => {
      res.status(200).json({
        error: false,
        response: result,
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        response: e.message,
      });
    });
};

// get a single user
exports.getAUser = async (req, res) => {
  User.findOne({
    where: {
      user_id: req.params.id,
    },
  })
    .then((result) => {
      res.status(200).json({
        error: false,
        response: result,
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        response: e.message,
      });
    });
};

exports.getUserPermissions = async (req, res) => {
  UserRole.findAll({
    where: {
      user_id: req.params.id,
    },
    include: [
      {
        model: RoleGroup,
      },
    ],
  })
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: true,
        message: error.message,
      });
    });
};

exports.getAllRoleGroups = async (req, res) => {
  RoleGroup.findAll()
    .then((result) => {
      res.status(200).json({
        error: false,
        response: result,
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        response: e.message,
      });
    });
};

// user login
exports.Userlogin = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({
    where: {
      email: email,
    },
    raw: true,
  })
    .then((data) => {
      bcrypt.compare(password, data.password, (_err, result) => {
        if (!result) {
          res.status(400).json({
            error: true,
            message: "Invalid Password!",
          });
        } else {
          const token = jwt.sign(
            { userId: data.user_id },
            config.development.JWT_SECRET,
            { expiresIn: "24h" }
          );
          if (token) {
            res.status(200).json({
              error: false,
              token: token,
            });
          } else {
            res.status(400).json({
              error: true,
              message: "Some unknown error",
            });
          }
        }
      });
    })
    .catch((e) => {
      res.status(401).json({
        error: false,
        message: "Couldn't find User!",
      });
    });
};

exports.Adminlogin = async (req, res) => {
  const { email, password } = req.body;
  if (email !== "admin@vidyagxp.com") {
    res.status(401).json({
      error: false,
      message: "Couldn't find User!",
    });
  } else {
    if (password !== "Amit@121") {
      res.status(400).json({
        error: false,
        message: "Incorrect Password!",
      });
    } else {
      const token = jwt.sign(
        { user: "Admin" },
        config.development.JWT_ADMIN_SECRET,
        {
          expiresIn: "24h",
        }
      );
      if (token) {
        res.status(200).json({
          error: false,
          token: token,
        });
      } else {
        res.status(400).json({
          error: true,
          message: "Some unknown error",
        });
      }
    }
  }
};
