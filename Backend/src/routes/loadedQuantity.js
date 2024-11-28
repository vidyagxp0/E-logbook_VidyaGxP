const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const LoadedQuantityRecordProcess = require("../controllers/LoadedQuantityRecordProcess");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../documents/elog_docs/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const originalName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize the original name if necessary
    const newFilename = `${uniqueSuffix}-${sanitizedOriginalName}${path.extname(
      file.originalname
    )}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

// post LoadedQuantityRecordProcess elog
router.post(
  "/post",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(3, 1),
  LoadedQuantityRecordProcess.InsertLoadedQuantity
);

// edit LoadedQuantityRecordProcess elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(3, 1),
  LoadedQuantityRecordProcess.EditLoadedQuantity
);

// //get a LoadedQuantityRecordProcess elog by id
router.get(
  "/get/:id",
  Auth.checkUserJwtToken,
  LoadedQuantityRecordProcess.GettLoadedQuantity
);

// //get all the LoadedQuantityRecordProcess elogs
router.get(
  "/get-all",
  Auth.checkUserJwtToken,
  LoadedQuantityRecordProcess.GetAlltLoadedQuantity
);

//send LoadedQuantityRecordProcess elog for review
router.put(
  "/send-for-review",
  Auth.checkUserJwtToken,
  upload.single("initiatorAttachment"),
  Auth.authorizeUserRole(3, 1),
  LoadedQuantityRecordProcess.SendDPElogForReview
);

// change status of LoadedQuantityRecordProcess elog from review to open
router.put(
  "/send-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(3, 2),
  LoadedQuantityRecordProcess.SendDPElogfromReviewToOpen
);

// send LoadedQuantityRecordProcess elog from review to approval
router.put(
  "/send-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(3, 2),
  LoadedQuantityRecordProcess.SendDPfromReviewToApproval
);

// send LoadedQuantityRecordProcess elog from under-approval to open
router.put(
  "/send-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(3, 3),
  LoadedQuantityRecordProcess.SendDPfromApprovalToOpen
);

// APPROVE LoadedQuantityRecordProcess elog
router.put(
  "/approve",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(3, 3),
  LoadedQuantityRecordProcess.ApproveDPElog
);

// // get users based on roles, sites and processes
// router.post(
//   "/get-user-roleGroups",
//   Auth.checkUserJwtToken,
//   LoadedQuantityRecordProcess.GetUserOnBasisOfRoleGroup
// );

// router.get("/get-processes", LoadedQuantityRecordProcess.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  LoadedQuantityRecordProcess.getAuditTrailForAnElog
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  LoadedQuantityRecordProcess.generateReport
);
router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  LoadedQuantityRecordProcess.chatByPdf
);

router.post("/view-report", LoadedQuantityRecordProcess.viewReport);
router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  LoadedQuantityRecordProcess.effetiveChatByPdf
);

router.post(
  "/effective-view-report",
  LoadedQuantityRecordProcess.effetiveViewReport
);
router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  LoadedQuantityRecordProcess.blankReport
);
module.exports = router;
