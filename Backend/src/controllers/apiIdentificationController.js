const IdentificationMaster = require("../models/apiIdentificationMasterModel");

exports.createIdentification = async (req, res) => {
  try {
    const { apiIdentificationData } = req.body;

    if (!apiIdentificationData) {
      return res.status(400).json({
        message: "apiIdentificationData is required",
      });
    }

    const data = await IdentificationMaster.create({
      apiIdentificationData,
    });

    return res.status(201).json({
      message: "Identification Master created successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getAllIdentification = async (req, res) => {
  try {
    const data = await IdentificationMaster.findAll({
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      message: "Identification Master list fetched successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getIdentificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await IdentificationMaster.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Identification Master not found",
      });
    }

    return res.status(200).json({
      message: "Identification Master fetched successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.updateIdentification = async (req, res) => {
  try {
    const { id } = req.params;
    const { apiIdentificationData } = req.body;

    const data = await IdentificationMaster.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Identification Master not found",
      });
    }

    await data.update({
      apiIdentificationData,
    });

    return res.status(200).json({
      message: "Identification Master updated successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.deleteIdentification = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await IdentificationMaster.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Identification Master not found",
      });
    }

    await data.destroy();

    return res.status(200).json({
      message: "Identification Master deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
