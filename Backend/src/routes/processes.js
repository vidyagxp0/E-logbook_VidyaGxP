const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const Process = require("../controllers/process");

router.post(
  "/post-differential-pressure",
  Auth.checkUserJwtToken,
  Auth.authorizeUserRole( 1, 1),
  Process.InsertDifferentialPressure
);
router.put(
  "/update-differential-pressure",
  Auth.checkUserJwtToken,
  Auth.authorizeUserRole( 1, 1),
  Process.EditDifferentialPressure
);
router.get(
  "/get-differential-pressure/:id",
  Auth.checkUserJwtToken,
  Process.GetDifferentialPressureElog
);
router.get(
  "/get-all-differential-pressure",
  Auth.checkUserJwtToken,
  Process.GetAllDifferentialPressureElog
);
router.get("/get-processes", Auth.checkAdminJwtToken, Process.getAllProcesses);

module.exports = router;
