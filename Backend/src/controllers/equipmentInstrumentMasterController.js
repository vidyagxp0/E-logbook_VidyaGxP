const equipmentInstrumentMaster = require("../models/equipmentInstrumentMasterModel");

// create
exports.createEquipmentInstrument = async (req, res) => {
  try {
    const { equipmentInstrumentData } = req.body;

    if (!equipmentInstrumentData) {
      return res.status(400).json({
        message: "equipmentInstrumentData is required",
      });
    }
    const data = await equipmentInstrumentMaster.create({
      equipmentInstrumentData,
    });
    
    return res.status(201).json({
      success: true,
      message: "Equipment / Instrument created successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// getById
exports.getEquipmentInstrumentById = async (req, res) => {
  try {
    const { id } = req.params;
     
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }
    
    const data = await equipmentInstrumentMaster.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      data,
    });
     
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// get all
exports.getAllEquipmentInstrument = async (req, res) => {
  try {
    const data = await equipmentInstrumentMaster.findAll({
      order: [["id", "DESC"]],
    });
    
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//update
exports.updateEquipmentInstrument = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const record = await equipmentInstrumentMaster.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await record.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: record,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//delete
exports.deleteEquipmentInstrument = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const record = await equipmentInstrumentMaster.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
