const SiteMaster = require("../models/siteMasterModel");

exports.createSiteMaster = async (req, res) => {
  try {
    const { siteMasterData } = req.body;

    if (!siteMasterData || typeof siteMasterData !== "object") {
      return res.status(400).json({
        success: false,
        message: "siteMasterData must be a valid JSON object",
      });
    }

    const record = await SiteMaster.create({ siteMasterData });

    return res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllSiteMasters = async (req, res) => {
  try {
    const records = await SiteMaster.findAll({
      order: [["id", "DESC"]],
    });

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSiteMasterById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const record = await SiteMaster.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateSiteMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { siteMasterData } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    if (!siteMasterData || typeof siteMasterData !== "object") {
      return res.status(400).json({
        success: false,
        message: "siteMasterData must be a valid JSON object",
      });
    }

    const record = await SiteMaster.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await record.update({ siteMasterData });

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteSiteMaster = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const record = await SiteMaster.findByPk(id);

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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
