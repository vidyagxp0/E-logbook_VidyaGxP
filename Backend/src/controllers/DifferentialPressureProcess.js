const DifferentialPressureForm = require("../models/differentialPressureForm");
const DifferentialPressureRecord = require("../models/differentialPressureRecords");
const Process = require("../models/processes");
const { sequelize } = require("../config/db");
const User = require("../models/users");
const UserRole = require("../models/userRoles");
const { Op, ValidationError } = require("sequelize");
const bcrypt = require("bcrypt");
const { getElogDocsUrl } = require("../middlewares/authentication");
const DifferentialPressureAuditTrail = require("../models/differentialPressureAuditTrail");
const Mailer = require("../middlewares/mailer");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const getUserById = async (user_id) => {
  const user = await User.findOne({ where: { user_id, isActive: true } });
  return user;
};

// Fill Differential pressure form and insert its records.
exports.InsertDifferentialPressure = async (req, res) => {
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

  if (!initiatorComment) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide an initiator comment." });
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
    const supportingDocs = {};

    // Process files
    req.files.forEach((file) => {
      if (file.fieldname === "initiatorAttachment") {
        initiatorAttachment = file;
      } else if (file.fieldname === "additionalAttachment") {
        additionalAttachment = file;
      } else if (file.fieldname.startsWith("FormRecordsArray[")) {
        // Extract the index from the fieldname
        const match = file.fieldname.match(
          /FormRecordsArray\[(\d+)\]\[supporting_docs\]/
        );
        if (match) {
          const index = match[1];
          supportingDocs[index] = file;
        }
      }
    });

    // Create new Differential Pressure Form
    const newForm = await DifferentialPressureForm.create(
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

    if (additionalAttachment) {
      auditTrailEntries.push({
        form_id: newForm.form_id,
        field_name: "additionalAttachment",
        previous_value: null,
        new_value: getElogDocsUrl(additionalAttachment),
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
        time: record?.time, // Assuming time was meant here instead of unique_id again
        differential_pressure: record?.differential_pressure,
        remarks: record?.remarks,
        checked_by: record?.checked_by,
        supporting_docs: getElogDocsUrl(supportingDocs[index]),
      }));

      await DifferentialPressureRecord.bulkCreate(formRecords, { transaction });

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
          field_name: `Time[${index}]`,
          previous_value: null,
          new_value: record.time,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `DifferentialPressure[${index}]`,
          previous_value: null,
          new_value: record.differential_pressure,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `Remarks[${index}]`,
          previous_value: null,
          new_value: record.remarks,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: `CheckedBy[${index}]`,
          previous_value: null,
          new_value: record.checked_by,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        if (supportingDocs[index]) {
          auditTrailEntries.push({
            form_id: newForm.form_id,
            field_name: `SupportingDocs[${index}]`,
            previous_value: null,
            new_value: getElogDocsUrl(supportingDocs[index]),
            changed_by: user.user_id,
            previous_status: "Not Applicable",
            new_status: "Opened",
            declaration: initiatorDeclaration,
            action: "Opened",
          });
        }
      });
    }

    await DifferentialPressureAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    await transaction.commit();

    const elogData = {
      initiator: user.name,
      dateOfInitiation: new Date().toISOString().split("T")[0], // Current date
      description,
      status: "Opened",
      reviewerName: (await getUserById(reviewer_id)).name,
      approverName: (await getUserById(approver_id)).name,
      reviewerEmail: (await getUserById(reviewer_id)).email,
      approverEmail: (await getUserById(approver_id)).email,
      recipients: [
        (await getUserById(reviewer_id)).email,
        (await getUserById(approver_id)).email,
      ].join(","),
    };

    // try {
    //   // Send emails
    //   await Mailer.sendEmail("assignReviewer", {
    //     ...elogData,
    //     recipients: elogData.reviewerEmail,
    //   });

    //   await Mailer.sendEmail("assignApprover", {
    //     ...elogData,
    //     recipients: elogData.approverEmail,
    //   });

    return res.status(200).json({
      error: false,
      message: "E-log Created successfully",
    });
    // } catch (emailError) {
    //   console.error("Failed to send emails:", emailError.message);
    //   return res.json({
    //     error: true,
    //     message: "E-log Created but failed to send emails.",
    //   });
    // }
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
exports.EditDifferentialPressure = async (req, res) => {
  const {
    form_id,
    site_id,
    description,
    department,
    compression_area,
    limit,
    reviewer_id,
    approver_id,
    DifferentialPressureRecords,
    email,
    password,
    initiatorComment,
    initiatorDeclaration,
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
    const supportingDocs = {};

    req.files.forEach((file) => {
      if (file.fieldname === "initiatorAttachment") {
        initiatorAttachment = file;
      } else if (file.fieldname === "additionalAttachment") {
        additionalAttachment = file;
      } else if (file.fieldname.startsWith("DifferentialPressureRecords[")) {
        const match = file.fieldname.match(
          /DifferentialPressureRecords\[(\d+)\]\[supporting_docs\]/
        );
        if (match) {
          const index = match[1];
          supportingDocs[index] = file;
        }
      }
    });

    const form = await DifferentialPressureForm.findOne({
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
      additionalAttachment: additionalAttachment
        ? getElogDocsUrl(additionalAttachment)
        : form.additionalAttachment,
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
      },
      { transaction }
    );

    // Update the Form Records if provided
    if (
      Array.isArray(DifferentialPressureRecords) &&
      DifferentialPressureRecords.length > 0
    ) {
      const existingRecords = await DifferentialPressureRecord.findAll({
        where: { form_id: form_id },
        raw: true,
        // order: [["record_id", "DESC"]],
        transaction,
      });

      // Track changes for existing records
      existingRecords.forEach((existingRecord, index) => {
        DifferentialPressureRecords.sort(
          (a, b) => parseInt(a.record_id) - parseInt(b.record_id)
        );
        const newRecord = DifferentialPressureRecords[index];
        if (newRecord) {
          const recordFields = {
            differential_pressure: newRecord.differential_pressure,
            remarks: newRecord.remarks,
            supporting_docs:
              newRecord.supporting_docs ||
              getElogDocsUrl(supportingDocs[index]),
          };

          for (const [field, newValue] of Object.entries(recordFields)) {
            const oldValue = existingRecord[field];
            if (
              newValue !== undefined &&
              ((typeof newValue === "number" &&
                !areFloatsEqual(oldValue, newValue)) ||
                oldValue != newValue)
            ) {
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
      if (DifferentialPressureRecords.length > existingRecords.length) {
        for (
          let i = existingRecords.length;
          i < DifferentialPressureRecords.length;
          i++
        ) {
          const newRecord = DifferentialPressureRecords[i];
          const recordFields = {
            unique_id: newRecord?.unique_id,
            time: newRecord?.time,
            checked_by: newRecord?.checked_by,
            differential_pressure: newRecord.differential_pressure,
            remarks: newRecord.remarks,
            supporting_docs:
              newRecord.supporting_docs || getElogDocsUrl(supportingDocs[i]),
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
      await DifferentialPressureRecord.destroy({
        where: { form_id: form_id },
        transaction,
      });

      // Create new records
      const formRecords = DifferentialPressureRecords.map((record, index) => ({
        form_id: form_id,
        unique_id: record?.unique_id,
        time: record?.time,
        differential_pressure: record?.differential_pressure,
        remarks: record?.remarks,
        checked_by: record?.checked_by,
        supporting_docs: record?.supporting_docs
          ? record?.supporting_docs
          : getElogDocsUrl(supportingDocs[index]),
      }));

      await DifferentialPressureRecord.bulkCreate(formRecords, { transaction });
    }

    await DifferentialPressureAuditTrail.bulkCreate(auditTrailEntries, {
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
exports.GetDifferentialPressureElog = async (req, res) => {
  const form_id = req.params.id;

  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }

  DifferentialPressureForm.findOne({
    where: {
      form_id: form_id,
    },
    include: [
      {
        model: DifferentialPressureRecord,
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
exports.GetAllDifferentialPressureElog = async (req, res) => {
  DifferentialPressureForm.findAll({
    include: [
      {
        model: DifferentialPressureRecord,
      },
      {
        model: User,
        as: "reviewer", // Use the consistent alias 'reviewer'
        attributes: ["user_id", "name"], // Specify which user attributes to fetch (optional)
      },
      {
        model: User,
        as: "approver", // Use the consistent alias 'approver'
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
  const { form_id, email, password, initiatorDeclaration } = req.body;

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
    const form = await DifferentialPressureForm.findOne({
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
        additionalAttachment: req?.file
          ? getElogDocsUrl(req.file)
          : form.additionalAttachment,
      },
      { transaction }
    );

    // Insert audit trail entries
    await DifferentialPressureAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    // try {
    //   const reviewer = await getUserById(form.reviewer_id);
    //   // Send emails
    //   await Mailer.sendEmail("reminderReviewer", {
    //     reviewerName: reviewer.name,
    //     initiator: user.name,
    //     dateOfInitiation: new Date().toISOString().split("T")[0],
    //     description: form.description,
    //     status: "Under Review",
    //     recipients: reviewer.email,
    //   });

    return res.status(200).json({
      error: false,
      message: "E-log successfully sent for review",
    });
    // } catch (emailError) {
    //   console.error("Failed to send emails:", emailError.message);
    //   return res.json({
    //     error: true,
    //     message: "E-log Created but failed to send emails.",
    //   });
    // }
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
    const form = await DifferentialPressureForm.findOne({
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
    await DifferentialPressureAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    // try {
    //   const initiator = await getUserById(form.initiator_id);
    //   // Send emails
    //   await Mailer.sendEmail("reminderInitiator", {
    //     initiatorName: initiator.name,
    //     dateOfInitiation: new Date().toISOString().split("T")[0],
    //     description: form.description,
    //     status: "Opened",
    //     recipients: initiator.email,
    //   });

    return res.status(200).json({
      error: false,
      message: "E-log status successfully changed from review to Opened",
    });
    // } catch (emailError) {
    //   console.error("Failed to send emails:", emailError.message);
    //   return res.json({
    //     error: true,
    //     message: "E-log Created but failed to send emails.",
    //   });
    // }
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
    const form = await DifferentialPressureForm.findOne({
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
    await DifferentialPressureAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    // try {
    //   const approver = await getUserById(form.approver_id);
    //   // Send emails
    //   await Mailer.sendEmail("reminderApprover", {
    //     approverName: approver.name,
    //     dateOfInitiation: new Date().toISOString().split("T")[0],
    //     description: form.description,
    //     reviewer: user.name,
    //     status: "Under Approval",
    //     recipients: approver.email,
    //   });

    return res.status(200).json({
      error: false,
      message:
        "E-log status successfully changed from review to under-approval",
    });
    // } catch (emailError) {
    //   console.error("Failed to send emails:", emailError.message);
    //   return res.json({
    //     error: true,
    //     message: "E-log Created but failed to send emails.",
    //   });
    // }
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
    const form = await DifferentialPressureForm.findOne({
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
    await DifferentialPressureAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    // try {
    //   const initiator = await getUserById(form.initiator_id);
    //   // Send emails
    //   await Mailer.sendEmail("reminderInitiator", {
    //     initiatorName: initiator.name,
    //     dateOfInitiation: new Date().toISOString().split("T")[0],
    //     description: form.description,
    //     status: "Opened",
    //     recipients: initiator.email,
    //   });

    return res.status(200).json({
      error: false,
      message:
        "E-log status successfully changed from under-approval to under-review",
    });
    // } catch (emailError) {
    //   console.error("Failed to send emails:", emailError.message);
    //   return res.json({
    //     error: true,
    //     message: "E-log Created but failed to send emails.",
    //   });
    // }
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
    const form = await DifferentialPressureForm.findOne({
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
    await DifferentialPressureAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "E-log successfully closed",
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
exports.GetUserOnBasisOfRoleGroup = async (req, res) => {
  const { role_id, site_id, process_id } = req.body;

  try {
    // Fetch users based on role, site, and process
    const selectedUsers = await UserRole.findAll({
      where: {
        [Op.or]: [
          { role_id: role_id, process_id: process_id, site_id: site_id },
          { role_id: 5, process_id: process_id, site_id: site_id },
        ],
      },
      include: {
        model: User,
        where: { isActive: true },
      },
    });

    // Send the response with the fetched users
    return res.status(200).json({
      error: false,
      message: selectedUsers,
    });
  } catch (error) {
    // Catch any errors and send an appropriate response
    console.error("Error fetching users:", error);
    return res.status(500).json({
      error: true,
      message: `Error fetching users: ${error.message}`,
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
    const auditTrail = await DifferentialPressureAuditTrail.findAll({
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

    const getCurrentDateTime = () => {
      const now = new Date();
      return now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Specify using 24-hour format
      });
    };

    // Render HTML using EJS template
    const html = await new Promise((resolve, reject) => {
      res.render("report", { reportData }, (err, html) => {
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
      headerTemplate: `
<div class="header-container">
  <table class="header-table">
    <tr>
      <th colspan="2" class="header-title">Differential Pressure Records</th>
      <th rowspan="2" class="header-logo">
        <img src="${logoDataUri}" alt="Logo" style="max-width: 100px; height: auto;" />
      </th>
    </tr>
    <tr>
      <td class="header-info"><span style="font-weight: 600;">Form ID:</span>${reportData.form_id}</td>
      <td class="header-info"><span style="font-weight: 600;">Status:</span>${reportData?.status}</td>
    </tr>
  </table>
</div>

<style>
  .header-container {
    width: 100%;
    padding: 0 50px; /* Increased margin from left and right */
    box-sizing: border-box;
  }
  
  .header-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
    table-layout: fixed;
  }
  
  .header-table th, .header-table td {
    border: 1px solid #000;
    padding: 8px;
  }
  
  .header-table th {
    background-color: #f8f8f8;
    font-weight: bold;
  }
  
  .header-logo {
    text-align: center;
    width: 100px;
  }
  
  .header-title {
    text-align: center;
    font-size: 18px;
    margin: 10px 0;
  }
  
  .header-info {
    font-size: 12px;
    text-align: center;
  }
</style>
`,

      footerTemplate: `
<style>
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 10px;
    padding: 5px 0;
  }
  .leftContent, .centerContent, .rightContent {
    display: inline-block;
  }
  .centerContent {
    flex-grow: 1;
    text-align: center;
  }
  .leftContent {
    flex-grow: 0;
    padding-left: 20px;  /* Added padding to the left content */
  }
  .rightContent {
    flex-grow: 0;
    padding-right: 20px; /* Added padding to the right content */
  }
</style>
<div class="footer">
  <span class="leftContent">Printed on: ${getCurrentDateTime()}</span>
  <span class="centerContent">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
  <span class="rightContent">Printed by: ${user ? user.name : "Unknown"}</span>
</div>
`,
      margin: {
        top: "120px",
        bottom: "60px",
        right: "30px",
        left: "30px",
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
