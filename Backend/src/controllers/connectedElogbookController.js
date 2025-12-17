const connectedElogbookMaster = require("../models/connectedElogbookMasterModel");

// create
exports.createConnectedElogbook = async (req, res) => {
  try {
    const { connectedElogbookData } = req.body;

    if (!connectedElogbookData) {
      return res.status(400).json({
        success: false,
        message: "connectedElogbookData is required",
      });
    }

    const data = await connectedElogbookMaster.create({
      connectedElogbookData,
    });

    return res.status(201).json({
      success: true,
      message: "Connected Elogbook created successfully",
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
exports.getAllConnectedElogbook = async (req, res) => {
  try {
    const data = await connectedElogbookMaster.findAll({
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
exports.getConnectedElogbookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const data = await connectedElogbookMaster.findByPk(id);

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
exports.updateConnectedElogbook = async (req, res) => {
  try {
    const { id } = req.params;
    const { connectedElogbookData } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    if (!connectedElogbookData) {
      return res.status(400).json({
        success: false,
        message: "connectedElogbookData is required",
      });
    }

    const record = await connectedElogbookMaster.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    record.connectedElogbookData = connectedElogbookData;
    await record.save();

    return res.status(200).json({
      success: true,
      message: "Connected Elogbook updated successfully",
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
exports.deleteConnectedElogbook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const record = await connectedElogbookMaster.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "Connected Elogbook deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
