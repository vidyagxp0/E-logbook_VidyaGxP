const pmMeterMaster = require("../models/pmMeterMasterModel");

// create
exports.createPmMeterMaster = async (req, res) => {
  try {
    const { pmMeterMasterData } = req.body;

    if (!pmMeterMasterData) {
      return res.status(400).json({
        success: false,
        message: "pmMeterMasterData is required",
      });
    }

    const data = await pmMeterMaster.create({
      pmMeterMasterData,
    });

    return res.status(201).json({
      success: true,
      message: "PM Meter Master created successfully",
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
exports.getAllPmMeterMaster = async (req, res) => {
  try {
    const data = await pmMeterMaster.findAll({
      order: [["id", "DESC"]],
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Records not found",
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

// get by id
exports.getPmMeterMasterById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const data = await pmMeterMaster.findByPk(id);

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

// update
exports.updatePmMeterMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { pmMeterMasterData } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    if (!pmMeterMasterData) {
      return res.status(400).json({
        success: false,
        message: "pmMeterMasterData is required",
      });
    }

    const record = await pmMeterMaster.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    record.pmMeterMasterData = pmMeterMasterData;
    await record.save();

    return res.status(200).json({
      success: true,
      message: "PM Meter Master updated successfully",
      data: record,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// delete
exports.deletePmMeterMaster = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const record = await pmMeterMaster.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "PM Meter Master deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
