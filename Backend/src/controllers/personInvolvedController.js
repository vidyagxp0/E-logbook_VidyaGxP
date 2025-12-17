const personInvolved = require("../models/personInvolvedMastermodel");

// create
exports.createPersonInvolved = async (req, res) => {
  try {
    const { personInvolvedData } = req.body;

    if (!personInvolvedData) {
      return res.status(400).json({
        success: false,
        message: "personInvolvedData is required",
      });
    }

    const data = await personInvolved.create({
      personInvolvedData,
    });

    return res.status(201).json({
      success: true,
      message: "Person Involved created successfully",
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


// get-all
exports.getAllPersonInvolved = async (req, res) => {
  try {
    const data = await personInvolved.findAll({
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
exports.getPersonInvolvedById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await personInvolved.findByPk(id);

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
exports.updatePersonInvolved = async (req, res) => {
  try {
    const { id } = req.params;
    const { personInvolvedData } = req.body;

    const record = await personInvolved.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await record.update({
      personInvolvedData,
    });

    return res.status(200).json({
      success: true,
      message: "Person Involved updated successfully",
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
exports.deletePersonInvolved = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await personInvolved.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "Person Involved deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
