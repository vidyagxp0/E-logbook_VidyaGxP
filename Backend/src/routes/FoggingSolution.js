const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const FoggingSolution = require("../controllers/FoggingSolution");
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

// post differential pressure elog
router.post(
  "/post-fogging-solution",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(16, 1),
  FoggingSolution.InsertFoggingSolution
);

// edit differential pressure elog details
router.put(
  "/update-fogging-solution",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(1, 1),
  FoggingSolution.EditFoggingSolution
);

//get a differential pressure elog by id
router.get(
  "/get-fogging-solution/:id",
  Auth.checkUserJwtToken,
  FoggingSolution.GetFoggingSolutionElog
);

//get all the differential pressure elogs
router.get(
  "/get-all-fogging-solution",
  Auth.checkUserJwtToken,
  FoggingSolution.GetAllFoggingSolutionElog
);

//send differential pressure elog for review
router.put(
  "/send-FS-elog-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(16, 1),
  FoggingSolution.SendFSLogForReview
);

// change status of differential pressure elog from review to open
router.put(
  "/send-FS-elog-from-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(1, 2),
  FoggingSolution.SendFSElogfromReviewToOpen
);

// send differential pressure elog from review to approval
router.put(
  "/send-FS-from-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(16, 2),
  FoggingSolution.SendFSfromReviewToApproval
);

// send differential pressure elog from under-approval to open
router.put(
  "/send-FS-elog-from-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(16, 3),
  FoggingSolution.SendFSfromApprovalToOpen
);

// APPROVE differential pressure elog
router.put(
  "/approve-FS-elog",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(16, 3),
  FoggingSolution.ApproveFSElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  FoggingSolution.GetUserOnBasisOfRoleGroup
);

router.get("/get-processes", FoggingSolution.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  FoggingSolution.getAuditTrailForAnElog
);

router.get(
  "/get-audit-report/:formId/:type/:userId",
  FoggingSolution.generateAuditPdfbyId
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  FoggingSolution.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  FoggingSolution.chatByPdf
);

router.post("/view-report", FoggingSolution.viewReport);
router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  FoggingSolution.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  FoggingSolution.blankReport
);

router.post(
  "/effective-view-report",
  FoggingSolution.effetiveViewReport
);
router.post(
  "/send-report-on-mail/:id",
  upload.any(),
  FoggingSolution.sendReportOnMail
);

// router.get("/search", FoggingSolution.GetAll);

module.exports = router;
