const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt")

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [8, 255], // Minimum and maximum allowed length
        msg: "Password must be at least 8 characters long",
      },
    },
  },
  age: {
    type: DataTypes.INTEGER,
  },
  gender: {
    type: DataTypes.STRING,
  },
});

// User.belongsToMany(Project, { through: UserProject });
// Project.belongsToMany(User, { through: UserProject });

User.addHook('afterSync', async () => {
    try {
        const superAdmin = await User.findOne({ where: { email: 'admin@vidyagxp.com' } });
        if (!superAdmin) {
            const hashedPassword = await bcrypt.hash('Amit@121', 10);
            await User.create({
                name: 'Super Admin',
                email: 'admin@vidyagxp.com',
                password: hashedPassword,
            });
            console.log('Super admin user created');
        } else {
            console.log('Super admin user already exists');
        }
    } catch (error) {
        console.error('Error creating super admin user:', error);
    }
});


module.exports = User;
