const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const Process = require("../controllers/process");

router.post("/post-differential-pressure", Process.InsertDifferentialPressure);
router.get("/get-processes", Auth.checkAdminJwtToken, Process.getAllProcesses);

module.exports = router;
