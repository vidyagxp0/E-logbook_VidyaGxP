const DispenseOfMaterialForm = require("../models/dispensingOfMaterialForm");
const DispenseOfMaterialRecord = require("../models/dispensingOfMaterialRecords");
const Process = require("../models/processes");
const { sequelize } = require("../config/db");
const User = require("../models/users");
const UserRole = require("../models/userRoles");
const { Op, ValidationError } = require("sequelize");
const bcrypt = require("bcrypt");
const { getElogDocsUrl } = require("../middlewares/authentication");
const DispenseOfMatrialAuditTrail = require("../models/dispensingOfMaterialAuditTrail");
const Mailer = require("../middlewares/mailer");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const getUserById = async (user_id) => {
  const user = await User.findOne({ where: { user_id, isActive: true } });
  return user;
};

// Fill Differential pressure form and insert its records.
exports.InsertDispenseOfMaterialRecord = async (req, res) => {
  const {
    site_id,
    description,
    department,
    compression_area,
    limit,
    reviewer_id,
    approver_id,
    initiatorComment,
    email,
    password,
    FormRecordsArray,
    initiatorDeclaration,
    additionalAttachment,
    additionalInfo,
  } = req.body;

  if (!approver_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide an approver." });
  }
  if (!reviewer_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a reviewer." });
  }

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid e-signature." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid e-signature." });
    }

    let initiatorAttachment = null;
    let additionalAttachment = null;

    // Process files
    req?.files?.forEach((file) => {
      if (file.fieldname === "initiatorAttachment") {
        initiatorAttachment = file;
      } else if (file.fieldname === "additionalAttachment") {
        additionalAttachment = file;
      }
    });

    // Create new Differential Pressure Form
    const newForm = await DispenseOfMaterialForm.create(
      {
        site_id: site_id,
        initiator_id: user.user_id,
        initiator_name: user.name,
        description: description,
        status: "Opened",
        stage: 1,
        department: department,
        compression_area: compression_area,
        limit: limit,
        reviewer_id: reviewer_id,
        approver_id: approver_id,
        initiatorAttachment: getElogDocsUrl(initiatorAttachment),
        additionalAttachment: getElogDocsUrl(additionalAttachment),
        initiatorComment: initiatorComment,
        additionalInfo: additionalInfo,
      },

      { transaction }
    );

    const auditTrailEntries = [];
    const fields = {
      description,
      department,
      compression_area,
      limit,
      reviewer: (await getUserById(reviewer_id))?.name,
      approver: (await getUserById(approver_id))?.name,
      initiatorComment,
      additionalInfo,
    };
    for (const [field, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null && value !== "") {
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: field,
          previous_value: null,
          new_value: value,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
      }
    }

    if (initiatorAttachment) {
      auditTrailEntries.push({
        form_id: newForm.form_id,
        field_name: "initiatorAttachment",
        previous_value: null,
        new_value: getElogDocsUrl(initiatorAttachment),
        changed_by: user.user_id,
        previous_status: "Not Applicable",
        new_status: "Opened",
        declaration: initiatorDeclaration,
        action: "Opened",
      });
    }

    if (Array.isArray(FormRecordsArray) && FormRecordsArray.length > 0) {
      const formRecords = FormRecordsArray.map((record, index) => ({
        form_id: newForm?.form_id,
        unique_id: record?.unique_id,
        date:
          record?.date && !isNaN(new Date(record?.date))
            ? new Date(record?.date).toISOString()
            : null,
        on_time_auh: record?.on_time_auh,
        on_time_laf: record?.on_time_laf,
        on_time_uv_light: record?.on_time_uv_light,
        on_time_done_by: record?.on_time_done_by,
        name_of_material: record?.name_of_material,
        control_no: record?.control_no,
        dispensed_quantity: record?.dispensed_quantity,
        dispensed_by_qa: record?.dispensed_by_qa,
        dispensed_by_store: record?.dispensed_by_store,
        off_time_auh: record?.off_time_auh,
        off_time_laf: record?.off_time_laf,
        off_time_uv_light: record?.off_time_uv_light,
        uv_burning: record?.uv_burning,
        off_time_done_by: record?.off_time_done_by,
        cleaning_done_by: record?.cleaning_done_by,
        checked_by: record?.checked_by,
        weighing_balance_id: record?.weighing_balance_id,
        remark: record?.remark,
        reviewed_by: record?.reviewed_by,
      }));

      await DispenseOfMaterialRecord.bulkCreate(formRecords, {
        transaction,
      });

      formRecords.forEach((record, index) => {
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `UniqueId[${index}]`,
          previous_value: null,
          new_value: record.unique_id,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `Date[${index}]`,
          previous_value: null,
          new_value: record.date,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `on_time_auh[${index}]`,
          previous_value: null,
          new_value: record.on_time_auh,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `on_time_laf[${index}]`,
          previous_value: null,
          new_value: record.on_time_laf,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `on_time_uv_light[${index}]`,
          previous_value: null,
          new_value: record.on_time_uv_light,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `on_time_done_by[${index}]`,
          previous_value: null,
          new_value: record.on_time_done_by,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `name_of_material[${index}]`,
          previous_value: null,
          new_value: record.name_of_material,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `control_no[${index}]`,
          previous_value: null,
          new_value: record.control_no,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `dispensed_quantity[${index}]`,
          previous_value: null,
          new_value: record.dispensed_quantity,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `dispensed_by_qa[${index}]`,
          previous_value: null,
          new_value: record.dispensed_by_qa,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `dispensed_by_store[${index}]`,
          previous_value: null,
          new_value: record.dispensed_by_store,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `off_time_auh[${index}]`,
          previous_value: null,
          new_value: record.off_time_auh,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `off_time_uv_light[${index}]`,
          previous_value: null,
          new_value: record.off_time_uv_light,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `uv_burning[${index}]`,
          previous_value: null,
          new_value: record.uv_burning,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `off_time_done_by[${index}]`,
          previous_value: null,
          new_value: record.off_time_done_by,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `cleaning_done_by[${index}]`,
          previous_value: null,
          new_value: record.cleaning_done_by,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `weighing_balance_id[${index}]`,
          previous_value: null,
          new_value: record.weighing_balance_id,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `remark[${index}]`,
          previous_value: null,
          new_value: record.remark,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
      });
    }

    await DispenseOfMatrialAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

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

// edit differential pressure elog details
exports.EditDispenseOfMaterialRecord = async (req, res) => {
  const {
    form_id,
    site_id,
    description,
    department,
    compression_area,
    limit,
    reviewer_id,
    approver_id,
    DispenseOfMaterials,
    email,
    password,
    initiatorComment,
    initiatorDeclaration,
    additionalInfo,
  } = req.body;

  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid e-signature." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid e-signature." });
    }

    let initiatorAttachment = null;
    let additionalAttachment = null;

    req?.files?.forEach((file) => {
      if (file.fieldname === "initiatorAttachment") {
        initiatorAttachment = file;
      } else if (file.fieldname === "additionalAttachment") {
        additionalAttachment = file;
      }
    });

    const form = await DispenseOfMaterialForm.findOne({
      where: { form_id: form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Form not found." });
    }

    // Define epsilon for float comparison
    const EPSILON = 0.000001;

    // Function to compare floats with epsilon
    const areFloatsEqual = (a, b) => Math.abs(a - b) < EPSILON;

    // Track changes for the form
    const auditTrailEntries = [];
    const fields = {
      description,
      department,
      compression_area,
      limit,
      initiatorComment,
      initiatorAttachment: initiatorAttachment
        ? getElogDocsUrl(initiatorAttachment)
        : form.initiatorAttachment,
      additionalInfo,
    };

    for (const [field, newValue] of Object.entries(fields)) {
      const oldValue = form[field];
      if (
        newValue !== undefined &&
        ((typeof newValue === "number" &&
          !areFloatsEqual(oldValue, newValue)) ||
          oldValue != newValue)
      ) {
        auditTrailEntries.push({
          form_id: form.form_id,
          field_name: field,
          previous_value: oldValue || null,
          new_value: newValue,
          changed_by: user.user_id,
          previous_status: form.status,
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Update Elog",
        });
      }
    }

    // Update the form details
    await form.update(
      {
        site_id,
        description,
        department,
        compression_area,
        limit,
        reviewer_id,
        approver_id,
        initiatorAttachment: getElogDocsUrl(initiatorAttachment),
        additionalAttachment: getElogDocsUrl(additionalAttachment),
        initiatorComment,
        additionalInfo,
      },
      { transaction }
    );

    // Update the Form Records if provided
    if (Array.isArray(DispenseOfMaterials) && DispenseOfMaterials.length > 0) {
      const existingRecords = await DispenseOfMaterialRecord.findAll({
        where: { form_id: form_id },
        raw: true,
        // order: [["record_id", "DESC"]],
        transaction,
      });

      // Track changes for existing records
      existingRecords.forEach((existingRecord, index) => {
        DispenseOfMaterials.sort(
          (a, b) => parseInt(a.record_id) - parseInt(b.record_id)
        );
        const newRecord = DispenseOfMaterials[index];
        if (newRecord) {
          const recordFields = {
            unique_id: newRecord?.unique_id,
            date:
              newRecord?.date && !isNaN(new Date(newRecord?.date))
                ? new Date(newRecord?.date).toISOString()
                : null,
            on_time_auh: newRecord?.on_time_auh,
            on_time_laf: newRecord?.on_time_laf,
            on_time_uv_light: newRecord?.on_time_uv_light,
            on_time_done_by: newRecord?.on_time_done_by,
            name_of_material: newRecord?.name_of_material,
            control_no: newRecord?.control_no,
            dispensed_quantity: newRecord?.dispensed_quantity,
            dispensed_by_qa: newRecord?.dispensed_by_qa,
            dispensed_by_store: newRecord?.dispensed_by_store,
            off_time_auh: newRecord?.off_time_auh,
            off_time_laf: newRecord?.off_time_laf,
            off_time_uv_light: newRecord?.off_time_uv_light,
            uv_burning: newRecord?.uv_burning,
            off_time_done_by: newRecord?.off_time_done_by,
            cleaning_done_by: newRecord?.cleaning_done_by,
            checked_by: newRecord?.checked_by,
            weighing_balance_id: newRecord?.weighing_balance_id,
            remark: newRecord?.remark,
            reviewed_by: newRecord?.reviewed_by,
          };

          for (const [field, newValue] of Object.entries(recordFields)) {
            const oldValue = existingRecord[field];

            {
              auditTrailEntries.push({
                form_id: form.form_id,
                field_name: `${field}[${index}]`,
                previous_value: oldValue || null,
                new_value: newValue,
                changed_by: user.user_id,
                previous_status: form.status,
                new_status: "Opened",
                declaration: initiatorDeclaration,
                action: "Update Elog",
              });
            }
          }
        }
      });

      // Handle new records added
      if (DispenseOfMaterials.length > existingRecords.length) {
        for (
          let i = existingRecords.length;
          i < DispenseOfMaterials.length;
          i++
        ) {
          const newRecord = DispenseOfMaterials[i];
          const recordFields = {
            unique_id: newRecord?.unique_id,
            date:
              newRecord?.date && !isNaN(new Date(newRecord?.date))
                ? new Date(newRecord?.date).toISOString()
                : null,
            on_time_auh: newRecord?.on_time_auh,
            on_time_laf: newRecord?.on_time_laf,
            on_time_uv_light: newRecord?.on_time_uv_light,
            on_time_done_by: newRecord?.on_time_done_by,
            name_of_material: newRecord?.name_of_material,
            control_no: newRecord?.control_no,
            dispensed_quantity: newRecord?.dispensed_quantity,
            dispensed_by_qa: newRecord?.dispensed_by_qa,
            dispensed_by_store: newRecord?.dispensed_by_store,
            off_time_auh: newRecord?.off_time_auh,
            off_time_laf: newRecord?.off_time_laf,
            off_time_uv_light: newRecord?.off_time_uv_light,
            uv_burning: newRecord?.uv_burning,
            off_time_done_by: newRecord?.off_time_done_by,
            cleaning_done_by: newRecord?.cleaning_done_by,
            checked_by: newRecord?.checked_by,
            weighing_balance_id: newRecord?.weighing_balance_id,
            remark: newRecord?.remark,
            reviewed_by: newRecord?.reviewed_by,
          };

          for (const [field, newValue] of Object.entries(recordFields)) {
            if (newValue !== undefined) {
              auditTrailEntries.push({
                form_id: form.form_id,
                field_name: `${field}[${i}]`,
                previous_value: null,
                new_value: newValue,
                changed_by: user.user_id,
                previous_status: form.status,
                new_status: "Opened",
                declaration: initiatorDeclaration,
                action: "Update Elog",
              });
            }
          }
        }
      }

      // Delete existing records for the form
      await DispenseOfMaterialRecord.destroy({
        where: { form_id: form_id },
        transaction,
      });

      // Create new records
      const formRecords = DispenseOfMaterials.map((record, index) => ({
        form_id: form_id,
        unique_id: record?.unique_id,
        date:
          record?.date && !isNaN(new Date(record?.date))
            ? new Date(record?.date).toISOString()
            : null,
        on_time_auh: record?.on_time_auh,
        on_time_laf: record?.on_time_laf,
        on_time_uv_light: record?.on_time_uv_light,
        on_time_done_by: record?.on_time_done_by,
        name_of_material: record?.name_of_material,
        control_no: record?.control_no,
        dispensed_quantity: record?.dispensed_quantity,
        dispensed_by_qa: record?.dispensed_by_qa,
        dispensed_by_store: record?.dispensed_by_store,
        off_time_auh: record?.off_time_auh,
        off_time_laf: record?.off_time_laf,
        off_time_uv_light: record?.off_time_uv_light,
        uv_burning: record?.uv_burning,
        off_time_done_by: record?.off_time_done_by,
        cleaning_done_by: record?.cleaning_done_by,
        checked_by: record?.checked_by,
        weighing_balance_id: record?.weighing_balance_id,
        remark: record?.remark,
        reviewed_by: record?.reviewed_by,
      }));

      await DispenseOfMaterialRecord.bulkCreate(formRecords, {
        transaction,
      });
    }

    await DispenseOfMatrialAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "E-log Updated successfully",
    });
  } catch (error) {
    await transaction.rollback();

    let errorMessage = "Error during updating elog";
    if (error instanceof ValidationError) {
      errorMessage = error.errors.map((e) => e.message).join(", ");
    }

    return res.status(500).json({
      error: true,
      message: `${errorMessage}: ${error.message}`,
    });
  }
};

//get a differential pressure elog by id
exports.GetDispenseOfMaterialRecord = async (req, res) => {
  const form_id = req.params.id;

  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }

  DispenseOfMaterialForm.findOne({
    where: {
      form_id: form_id,
    },
    include: [
      {
        model: DispenseOfMaterialRecord,
      },
    ],
  })
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: true,
        message: error.message,
      });
    });
};

//get all the differential pressure elogs
exports.GetAllDispenseOfMaterialRecord = async (req, res) => {
  DispenseOfMaterialForm.findAll({
    include: [
      {
        model: DispenseOfMaterialRecord,
      },
      {
        model: User,
        as: "reviewer4", // Use the consistent alias 'reviewer'
        attributes: ["user_id", "name"], // Specify which user attributes to fetch (optional)
      },
      {
        model: User,
        as: "approver4", // Use the consistent alias 'approver'
        attributes: ["user_id", "name"], // Specify which user attributes to fetch (optional)
      },
    ],
    order: [["form_id", "DESC"]],
  })
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: true,
        message: error.message,
      });
    });
};

//send differential pressure elog for review
exports.SendDPElogForReview = async (req, res) => {
  const { form_id, email, password, initiatorDeclaration, initiatorComment } =
    req.body;

  // Check for required fields and provide specific error messages
  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the form
    const form = await DispenseOfMaterialForm.findOne({
      where: { form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Elog not found." });
    }

    // if (form.stage !== 1) {
    //   await transaction.rollback();
    //   return res.status(400).json({
    //     error: true,
    //     message: "Elog is not in a valid stage to be sent for review.",
    //   });
    // }

    const auditTrailEntries = [];

    // Add audit trail entry for the attachment if it exists
    if (req?.file) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "initiatorAttachment",
        previous_value: form.initiatorAttachment || null,
        new_value: getElogDocsUrl(req.file),
        changed_by: user.user_id,
        previous_status: "Opened",
        new_status: "Under Review",
        declaration: initiatorDeclaration,
        action: "Send For Review",
      });
    }
    if (req?.file) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "additionalAttachment",
        previous_value: form.additionalAttachment || null,
        new_value: getElogDocsUrl(req.file),
        changed_by: user.user_id,
        previous_status: "Opened",
        new_status: "Under Review",
        declaration: initiatorDeclaration,
        action: "Send For Review",
      });
    }

    auditTrailEntries.push({
      form_id: form.form_id,
      field_name: "stage Change",
      previous_value: "Not Applicable",
      new_value: "Not Applicable",
      changed_by: user.user_id,
      previous_status: "Opened",
      new_status: "Under Review",
      declaration: initiatorDeclaration,
      action: "Send For Review",
    });

    // Update the form details
    await form.update(
      {
        status: "Under Review",
        stage: 2,
        initiatorAttachment: req?.file
          ? getElogDocsUrl(req.file)
          : form.initiatorAttachment,
        initiatorComment: initiatorComment,
        additionalAttachment: req?.file
          ? getElogDocsUrl(req.file)
          : form.additionalAttachment,
      },
      { transaction }
    );

    // Insert audit trail entries
    await DispenseOfMatrialAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "E-log successfully sent for review",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during sending E-log for review: ${error.message}`,
    });
  }
};

// change status of differential pressure elog from review to open
exports.SendDPElogfromReviewToOpen = async (req, res) => {
  const { form_id, email, password, reviewerDeclaration } = req.body;

  // Check for required fields and provide specific error messages
  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, email, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the form
    const form = await DispenseOfMaterialForm.findOne({
      where: { form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Elog not found." });
    }

    if (form.stage !== 2) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Elog is not in a valid stage.",
      });
    }

    const auditTrailEntries = [];

    // Add audit trail entry for the attachment if it exists
    if (req?.file) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "reviewerAttachment",
        previous_value: form.reviewerAttachment || null,
        new_value: getElogDocsUrl(req.file),
        changed_by: user.user_id,
        previous_status: "Under Review",
        new_status: "Opened",
        declaration: reviewerDeclaration,
        action: "Open Elog",
      });
    }

    auditTrailEntries.push({
      form_id: form.form_id,
      field_name: "stage Change",
      previous_value: "Not Applicable",
      new_value: "Not Applicable",
      changed_by: user.user_id,
      previous_status: "Under Review",
      new_status: "Opened",
      declaration: reviewerDeclaration,
      action: "Open Elog",
    });

    // Update the form details
    await form.update(
      {
        status: "Opened",
        stage: 1,
        reviewerAttachment: getElogDocsUrl(req?.file),
      },
      { transaction }
    );

    // Insert audit trail entries
    await DispenseOfMatrialAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "E-log status successfully changed from review to Opened",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during changing stage of elog: ${error.message}`,
    });
  }
};

// send differential pressure elog from review to approval
exports.SendDPfromReviewToApproval = async (req, res) => {
  const { form_id, reviewComment, email, password, reviewerDeclaration } =
    req.body;

  // Check for required fields and provide specific error messages
  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!reviewComment) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a review comment." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, email, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the form
    const form = await DispenseOfMaterialForm.findOne({
      where: { form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Elog not found." });
    }

    if (form.stage !== 2) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Elog is not in a valid stage to be sent for approval.",
      });
    }

    const auditTrailEntries = [];

    if (reviewComment) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "reviewComment",
        previous_value: form.reviewComment || null,
        new_value: reviewComment,
        changed_by: user.user_id,
        previous_status: "Under Review",
        new_status: "Under Approval",
        declaration: reviewerDeclaration,
        action: "Send For Approval",
      });
    }

    // Add audit trail entry for the attachment if it exists
    if (req?.file) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "reviewerAttachment",
        previous_value: form.reviewerAttachment || null,
        new_value: getElogDocsUrl(req.file),
        changed_by: user.user_id,
        previous_status: "Under Review",
        new_status: "Under Approval",
        declaration: reviewerDeclaration,
        action: "Send For Approval",
      });
    }

    auditTrailEntries.push({
      form_id: form.form_id,
      field_name: "stage Change",
      previous_value: "Not Applicable",
      new_value: "Not Applicable",
      changed_by: user.user_id,
      previous_status: "Under Review",
      new_status: "Under Approval",
      declaration: reviewerDeclaration,
      action: "Send For Approval",
    });

    // Update the form details
    await form.update(
      {
        status: "Under Approval",
        stage: 3,
        reviewComment: reviewComment,
        reviewerAttachment: req?.file
          ? getElogDocsUrl(req.file)
          : form.reviewerAttachment,
        date_of_review: new Date(),
      },
      { transaction }
    );

    // Insert audit trail entries
    await DispenseOfMatrialAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message:
        "E-log status successfully changed from review to under-approval",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during sending E-log for approval: ${error.message}`,
    });
  }
};

// send differential pressure elog from under approval to open
exports.SendDPfromApprovalToOpen = async (req, res) => {
  const { form_id, email, password, approverDeclaration } = req.body;

  // Check for required fields and provide specific error messages
  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, email, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the form
    const form = await DispenseOfMaterialForm.findOne({
      where: { form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Elog not found." });
    }

    if (form.stage !== 3) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Elog is not in a valid stage.",
      });
    }

    const auditTrailEntries = [];

    // Add audit trail entry for the attachment if it exists
    if (req?.file) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "approverAttachment",
        previous_value: form.approverAttachment || null,
        new_value: getElogDocsUrl(req.file),
        changed_by: user.user_id,
        previous_status: "Under Approval",
        new_status: "Under Review",
        declaration: approverDeclaration,
        action: "Open Elog",
      });
    }

    auditTrailEntries.push({
      form_id: form.form_id,
      field_name: "stage Change",
      previous_value: "Not Applicable",
      new_value: "Not Applicable",
      changed_by: user.user_id,
      previous_status: "Under Approval",
      new_status: "Under Review",
      declaration: approverDeclaration,
      action: "Open Elog",
    });

    // Update the form details
    await form.update(
      {
        status: "Under Review",
        stage: 2,
        approverAttachment: getElogDocsUrl(req?.file),
      },
      { transaction }
    );

    // Insert audit trail entries
    await DispenseOfMatrialAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message:
        "E-log status successfully changed from under-approval to under-review",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during changing stage of elog: ${error.message}`,
    });
  }
};

// APPROVE differential pressure elog
exports.ApproveDPElog = async (req, res) => {
  const { form_id, approverComment, email, password, approverDeclaration } =
    req.body;

  // Check for required fields and provide specific error messages
  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!approverComment) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide an approver comment." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, email, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the form
    const form = await DispenseOfMaterialForm.findOne({
      where: { form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Elog not found." });
    }

    if (form.stage !== 3) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Elog is not in a valid stage.",
      });
    }

    const auditTrailEntries = [];

    if (approverComment) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "approverComment",
        previous_value: form.approverComment || null,
        new_value: approverComment,
        changed_by: user.user_id,
        previous_status: "Under Approval",
        new_status: "Closed",
        declaration: approverDeclaration,
        action: "Closed",
      });
    }

    // Add audit trail entry for the attachment if it exists
    if (req?.file) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "approverAttachment",
        previous_value: form.approverAttachment || null,
        new_value: getElogDocsUrl(req.file),
        changed_by: user.user_id,
        previous_status: "Under Approval",
        new_status: "Closed",
        declaration: approverDeclaration,
        action: "Closed",
      });
    }

    auditTrailEntries.push({
      form_id: form.form_id,
      field_name: "stage Change",
      previous_value: "Not Applicable",
      new_value: "Not Applicable",
      changed_by: user.user_id,
      previous_status: "Under Approval",
      new_status: "Closed",
      declaration: approverDeclaration,
      action: "Closed",
    });

    // Update the form details
    await form.update(
      {
        status: "Closed",
        stage: 4,
        approverComment: approverComment,
        approverAttachment: req?.file
          ? getElogDocsUrl(req.file)
          : form.approverAttachment,
        date_of_approval: new Date(),
      },
      { transaction }
    );

    // Insert audit trail entries
    await DispenseOfMatrialAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "E-log successfully Closed!!",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error approving elog: ${error.message}`,
    });
  }
};

// get users based on roles, sites and processes
// exports.GetUserOnBasisOfRoleGroup = async (req, res) => {
//   const { role_id, site_id, process_id } = req.body;

//   try {
//     // Fetch users based on role, site, and process
//     const selectedUsers = await UserRole.findAll({
//       where: {
//         [Op.or]: [
//           { role_id: role_id, process_id: process_id, site_id: site_id },
//           { role_id: 5, process_id: process_id, site_id: site_id },
//         ],
//       },
//       include: {
//         model: User,
//         where: { isActive: true },
//       },
//     });

//     // Send the response with the fetched users
//     return res.status(200).json({
//       error: false,
//       message: selectedUsers,
//     });
//   } catch (error) {
//     // Catch any errors and send an appropriate response
//     console.error("Error fetching users:", error);
//     return res.status(500).json({
//       error: true,
//       message: `Error fetching users: ${error.message}`,
//     });
//   }
// };

// exports.getAllProcesses = async (req, res) => {
//   Process.findAll()
//     .then((result) => {
//       res.json({
//         error: false,
//         message: result,
//       });
//     })
//     .catch((error) => {
//       res.status(400).json({
//         error: true,
//         message: "Couldn't find processes " + error,
//       });
//     });
// };

exports.getAuditTrailForAnElog = async (req, res) => {
  try {
    // Extract form_id from request parameters
    const formId = req.params.id;

    // Check if form_id is provided
    if (!formId) {
      return res
        .status(400)
        .json({ error: true, message: "Form ID is required." });
    }

    // Find all audit trail entries for the given form_id
    const auditTrail = await DispenseOfMatrialAuditTrail.findAll({
      where: { form_id: formId },
      include: {
        model: User,
        attributes: ["user_id", "name"],
      },
      order: [["auditTrail_id", "DESC"]],
    });

    if (!auditTrail || auditTrail.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No audit trail found for the given form ID.",
      });
    }

    return res.status(200).json({ error: false, auditTrail });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: `Error retrieving audit trail: ${error.message}`,
    });
  }
};

exports.generateReport = async (req, res) => {
  try {
    let reportData = req.body.reportData;

    const date = new Date();
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Specify using 24-hour format
    });

    // Render HTML using EJS template
    const html = await new Promise((resolve, reject) => {
      res.render("dispensing_material_report", { reportData }, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const logoPath = path.join(__dirname, "../public/vidyalogo.png.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoDataUri = `data:image/png;base64,${logoBase64}`;

    const user = await getUserById(req.user.userId);

    // Set HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "header",
          { reportData: reportData, logoDataUri: logoDataUri },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),

      footerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "footer",
          { userName: user?.name, date: formattedDate },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),
      margin: {
        top: "150px",
        right: "50px",
        bottom: "50px",
        left: "50px",
      },
    });

    // Close the browser
    await browser.close();

    // Set response headers and send PDF
    res.set("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};
const removeHtmlTags = (htmlString) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, ""); // Removes all tags
};
exports.chatByPdf = async (req, res) => {
  try {
    const reportData = req.body.reportData;
    const formId = req.params.form_id;
    reportData.description = removeHtmlTags(reportData.description);
    
    const date = new Date();
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Specify using 24-hour format
    });

    // Render HTML using EJS template
    const html = await new Promise((resolve, reject) => {
      req.app.render(
        "dispensing_material_report",
        { reportData },
        (err, html) => {
          if (err) return reject(err);
          resolve(html);
        }
      );
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const logoPath = path.join(__dirname, "../public/vidyalogo.png.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoDataUri = `data:image/png;base64,${logoBase64}`;

    const user = await getUserById(req.user.userId);

    // Set HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "header",
          { reportData: reportData, logoDataUri: logoDataUri },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),

      footerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "footer",
          { userName: user?.name, date: formattedDate },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),
      margin: {
        top: "150px",
        right: "50px",
        bottom: "50px",
        left: "50px",
      },
    });

    // Close the browser
    await browser.close();

    const filePath = path.resolve("public", `Elog_Report_${formId}.pdf`);
    fs.writeFileSync(filePath, pdf);

    res.status(200).json({ filename: `Elog_Report_${formId}.pdf` });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};
exports.viewReport = async (req, res) => {
  try {
    let reportData = req.body.reportData;
    // Render HTML using EJS template
    req.app.render(
      "dispensing_material_report",
      { reportData },
      (err, html) => {
        if (err) {
          console.error("Error rendering HTML:", err);
          return res.status(500).send("Error rendering HTML", err);
        }
        res.send(html);
      }
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};

exports.effetiveChatByPdf = async (req, res) => {
  try {
    const reportData = req.body.reportData;
    const formId = req.params.form_id;
    reportData.addtionalInfo = reportData?.addtionalInfo
      ? removeHtmlTags(reportData?.addtionalInfo)
      : "Not Applicable";

    const date = new Date();
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Specify using 24-hour format
    });

    // Render HTML using EJS template
    const html = await new Promise((resolve, reject) => {
      req.app.render("effectiveDMReport", { reportData }, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const logoPath = path.join(__dirname, "../public/vidyalogo.png.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoDataUri = `data:image/png;base64,${logoBase64}`;

    const user = await getUserById(req.user.userId);

    // Set HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "header",
          { reportData: reportData, logoDataUri: logoDataUri },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),

      footerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "footer",
          { userName: user?.name, date: formattedDate },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),
      margin: {
        top: "150px",
        right: "50px",
        bottom: "50px",
        left: "50px",
      },
    });

    // Close the browser
    await browser.close();

    const filePath = path.resolve("public", `DM_Elog_Report_${formId}.pdf`);
    fs.writeFileSync(filePath, pdf);

    res.status(200).json({ filename: `DM_Elog_Report_${formId}.pdf` });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};
exports.effetiveViewReport = async (req, res) => {
  try {
    let reportData = req.body.reportData;
    // Render HTML using EJS template
    req.app.render("effectiveDMReport", { reportData }, (err, html) => {
      if (err) {
        console.error("Error rendering HTML:", err);
        return res.status(500).send("Error rendering HTML", err);
      }
      res.send(html);
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};
