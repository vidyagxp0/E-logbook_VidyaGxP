const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const DifferentialPressureProcess = require("../controllers/DifferentialPressureProcess");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../documents/elog_docs/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// post differential pressure elog
router.post(
  "/post-differential-pressure",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(1, 1),
  DifferentialPressureProcess.InsertDifferentialPressure
);

// edit differential pressure elog details
router.put(
  "/update-differential-pressure",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(1, 1),
  DifferentialPressureProcess.EditDifferentialPressure
);

//get a differential pressure elog by id
router.get(
  "/get-differential-pressure/:id",
  Auth.checkUserJwtToken,
  DifferentialPressureProcess.GetDifferentialPressureElog
);

//get all the differential pressure elogs
router.get(
  "/get-all-differential-pressure",
  Auth.checkUserJwtToken,
  DifferentialPressureProcess.GetAllDifferentialPressureElog
);

//send differential pressure elog for review
router.put(
  "/send-DP-elog-for-review",
  Auth.checkUserJwtToken,
  upload.single("initiatorAttachment"),
  Auth.authorizeUserRole(1, 1),
  DifferentialPressureProcess.SendDPElogForReview
);

// change status of differential pressure elog from review to open
router.put(
  "/send-DP-elog-from-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("initiatorAttachment"),
  Auth.authorizeUserRole(1, 2),
  DifferentialPressureProcess.SendDPElogfromReviewToOpen
);

// send differential pressure elog from review to approval
router.put(
  "/send-DP-from-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(1, 2),
  DifferentialPressureProcess.SendDPfromReviewToApproval
);

// send differential pressure elog from under-approval to open
router.put(
  "/send-DP-elog-from-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(1, 3),
  DifferentialPressureProcess.SendDPfromApprovalToOpen
);

// APPROVE differential pressure elog
router.put(
  "/approve-DP-elog",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(1, 3),
  DifferentialPressureProcess.ApproveDPElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  DifferentialPressureProcess.GetUserOnBasisOfRoleGroup
);

router.get("/get-processes", DifferentialPressureProcess.getAllProcesses);

module.exports = router;
