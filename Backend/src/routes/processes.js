const express = require('express');
const router = express.Router();
const Auth = require("../middlewares/authentication")
const Process = require("../controllers/process")




router.post('/post-differential-pressure', Process.InsertDifferentialPressure);


module.exports = router;