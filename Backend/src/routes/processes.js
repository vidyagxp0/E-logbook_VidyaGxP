const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const Process = require("../controllers/process");

// post differential pressure elog
router.post(
  "/post-differential-pressure",
  Auth.checkUserJwtToken,
  Auth.authorizeUserRole(1, 1),
  Process.InsertDifferentialPressure
);

// edit differential pressure elog details
router.put(
  "/update-differential-pressure",
  Auth.checkUserJwtToken,
  Auth.authorizeUserRole(1, 1),
  Process.EditDifferentialPressure
);

//get a differential pressure elog by id
router.get(
  "/get-differential-pressure/:id",
  Auth.checkUserJwtToken,
  Process.GetDifferentialPressureElog
);

//get all the differential pressure elogs
router.get(
  "/get-all-differential-pressure",
  Auth.checkUserJwtToken,
  Process.GetAllDifferentialPressureElog
);

//send differential pressure elog for review
router.put(
  "/send-DP-elog-for-review",
  Auth.checkUserJwtToken,
  Auth.authorizeUserRole(1, 1),
  Process.SendDPElogForReview
);

// change status of differential pressure elog from review to open
router.put(
  "/send-DP-elog-from-review-to-open",
  Auth.checkUserJwtToken,
  Auth.authorizeUserRole(1, 2),
  Process.SendDPElogfromReviewToOpen
);

// send differential pressure elog from review to approval
router.put(
  "/send-DP-from-review-to-approval",
  Auth.checkUserJwtToken,
  Auth.authorizeUserRole(1, 2),
  Process.SendDPfromReviewToApproval
);

// send differential pressure elog from under-approval to open
router.put(
  "/send-DP-elog-from-approval-to-open",
  Auth.checkUserJwtToken,
  Auth.authorizeUserRole(1, 3),
  Process.SendDPfromApprovalToOpen
);

// APPROVE differential pressure elog
router.put(
  "/approve-DP-elog",
  Auth.checkUserJwtToken,
  Auth.authorizeUserRole(1, 3),
  Process.ApproveDPElog
);

// get users based on roles, sites and processes
router.post('/get-user-roleGroups', Auth.checkUserJwtToken, Process.GetUserOnBasisOfRoleGroup);


router.get("/get-processes", Process.getAllProcesses);

module.exports = router;
