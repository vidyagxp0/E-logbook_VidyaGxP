const express = require('express');
const router = express.Router();
const Site = require("../controllers/sites");
const Auth = require("../middlewares/authentication")


router.get('/get-sites', Auth.checkAdminJwtToken, Site.getAllSites);


module.exports = router;