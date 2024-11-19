const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const Process = sequelize.define("Process", {
  process_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  process: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// User.belongsToMany(Project, { through: UserProject });
// Project.belongsToMany(User, { through: UserProject });

Process.addHook('afterSync', async () => {
    try {
        const processesCount = await Process.count();
        if (processesCount === 0) {
            await Process.bulkCreate([
                { process: 'Differential Pressure Record' },
                { process: 'Temperature Records' },
                { process: 'Loaded Quantity' },
                { process: 'Operation Of Sterilizer' },
                { process: 'Media Record' },
                { process: 'Dispensing Of Materials' },
            ]);
            console.log('Processes created');
        } else {
            console.log('Processes already exist');
        }
    } catch (error) {
        console.error('Error creating processes:', error);
    }
});


module.exports = Process;
