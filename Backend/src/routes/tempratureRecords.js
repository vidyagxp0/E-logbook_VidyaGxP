const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const TempratureProcess = require("../controllers/tempratureRecordProcess");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../documents/elog_docs/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize the original name if necessary
    const newFilename = `${uniqueSuffix}-${sanitizedOriginalName}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

// post differential pressure elog
router.post(
  "/post-temprature-record",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(4, 1),
  TempratureProcess.InsertTempratureRecord
);

// edit differential pressure elog details
router.put(
  "/update-temprature-record",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(4, 1),
  TempratureProcess.EditTempratureRecord
);

//get a differential pressure elog by id
router.get(
  "/get-temprature-record/:id",
  Auth.checkUserJwtToken,
  TempratureProcess.GetTempratureRecordElog
);

//get all the differential pressure elogs
router.get(
  "/get-all-temprature-record",
  Auth.checkUserJwtToken,
  TempratureProcess.GetAllTempratureRecordElog
);

//send differential pressure elog for review
router.put(
  "/send-TR-elog-for-review",
  Auth.checkUserJwtToken,
  upload.single("initiatorAttachment"),
  Auth.authorizeUserRole(4, 1),
  TempratureProcess.SendTRElogForReview
);

// change status of differential pressure elog from review to open
router.put(
  "/send-TR-elog-from-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("initiatorAttachment"),
  Auth.authorizeUserRole(4, 2),
  TempratureProcess.SendTRElogfromReviewToOpen
);

// send differential pressure elog from review to approval
router.put(
  "/send-TR-from-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(4, 2),
  TempratureProcess.SendTRfromReviewToApproval
);

// send differential pressure elog from under-approval to open
router.put(
  "/send-TR-elog-from-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(4, 3),
  TempratureProcess.SendTRfromApprovalToOpen
);

// APPROVE differential pressure elog
router.put(
  "/approve-TR-elog",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(4, 3),
  TempratureProcess.ApproveTRElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  TempratureProcess.GetUserOnBasisOfRoleGroup
);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  TempratureProcess.getAuditTrailForAnElog
);

module.exports = router;
