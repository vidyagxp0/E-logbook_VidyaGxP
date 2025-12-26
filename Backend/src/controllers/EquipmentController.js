const Equipments = require("../models/equipmentClearanceModel");
const sequelize = require("../config/db").sequelize;

exports.createEquipment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
    site_id,
    initiator_id,
    date_of_initiation,
    equipmentClearance,
    generalPrecautions,
    manufacturingPrecautions,
    formData,
    differentialPRecord
    } = req.body;

    if (
      !initiator_id ||
      !site_id ||
      !date_of_initiation ||
      !equipmentClearance ||
      !generalPrecautions ||
      !manufacturingPrecautions||!formData||!differentialPRecord
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const equipment = await Equipments.create(
      {
        site_id,
        initiator_id,
     
        date_of_initiation,
   
        equipmentClearance,
        generalPrecautions,
        manufacturingPrecautions,
        formData,
        differentialPRecord
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      message: "Equipment created successfully",
      data: equipment,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};

exports.updateEquipment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const equipment = await Equipments.findByPk(id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    await equipment.update(req.body, { transaction: t });

    await t.commit();

    return res.status(200).json({
      message: "Equipment updated successfully",
      data: equipment,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipments.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Equipments fetched successfully",
      data: equipments,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const equipment = await Equipments.findByPk(id);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    return res.status(200).json({
      message: "Equipment fetched successfully",
      data: equipment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteEquipment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const equipment = await Equipments.findByPk(id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    await equipment.destroy({ transaction: t });
    await t.commit();

    return res.status(200).json({
      message: "Equipment deleted successfully",
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};
