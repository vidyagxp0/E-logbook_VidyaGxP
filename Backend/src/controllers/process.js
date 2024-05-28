const DifferentialPressureForm = require("../models/differentialPressureForm");
const DifferentialPressureRecord = require("../models/differentialPressureRecords");
const Process = require("../models/processes");
const { sequelize } = require("../config/db");

// Fill Differential pressure form and insert its records.
exports.InsertDifferentialPressure = async (req, res) => {
  const {
    site_id,
    initiator_name,
    description,
    department,
    compression_area,
    limit,
    month,
    reviewer,
    approver,
    FormRecordsArray,
  } = req.body;

  // Check for required fields and provide specific error messages
  if (!site_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a site ID." });
  }
  if (!initiator_name) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide an initiator name." });
  }
  if (!approver) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide an approver." });
  }
  if (!reviewer) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a reviewer." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Create new Differential Pressure Form
    const newForm = await DifferentialPressureForm.create(
      {
        site_id: site_id,
        initiator_id: req.user.userId,
        initiator_name: initiator_name,
        description: description,
        status: "initiation",
        stage: 1,
        department: department,
        compression_area: compression_area,
        limit: limit,
        month: month,
        reviewer: reviewer,
        approver: approver,
      },
      { transaction }
    );

    // Check if FormRecordsArray is provided
    if (Array.isArray(FormRecordsArray) && FormRecordsArray.length > 0) {
      const formRecords = FormRecordsArray.map((record) => ({
        form_id: newForm?.form_id,
        unique_id: record?.unique_id,
        time: record?.time, // Assuming time was meant here instead of unique_id again
        differential_pressure: record?.differential_pressure,
        remarks: record?.remarks,
        checked_by: record?.checked_by,
        supporting_docs: record?.supporting_docs,
      }));

      await DifferentialPressureRecord.bulkCreate(formRecords, { transaction });
    }

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "E-log Created successfully",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    let errorMessage = "Error during creating elog";
    if (error instanceof ValidationError) {
      errorMessage = error.errors.map((e) => e.message).join(", ");
    }

    return res.status(500).json({
      error: true,
      message: `${errorMessage}: ${error.message}`,
    });
  }
};

exports.getAllProcesses = async (req, res) => {
  Process.findAll()
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: true,
        message: "Couldn't find processes " + error,
      });
    });
};
