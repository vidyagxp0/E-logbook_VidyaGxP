const excipientsDispensing = require("../models/excipientsDispensingModel");

//create
exports.createExcipientsDispensing = async (req, res) => {
  try {
    const { excipientsDispensingData } = req.body;

    if (!excipientsDispensingData) {
      return res.status(400).json({
        success: false,
        message: "excipientsDispensingData is required",
      });
    }

    const data = await excipientsDispensing.create({
      excipientsDispensingData,
    });

    return res.status(201).json({
      success: true,
      message: "Excipients Dispensing created successfully",
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
exports.getAllExcipientsDispensing = async (req, res) => {
  try {
    const data = await excipientsDispensing.findAll({
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

// get by id
exports.getExcipientsDispensingById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await excipientsDispensing.findByPk(id);

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
exports.updateExcipientsDispensing = async (req, res) => {
  try {
    const { id } = req.params;
    const { excipientsDispensingData } = req.body;

    const record = await excipientsDispensing.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await record.update({
      excipientsDispensingData,
    });

    return res.status(200).json({
      success: true,
      message: "Record updated successfully",
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
exports.deleteExcipientsDispensing = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await excipientsDispensing.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
