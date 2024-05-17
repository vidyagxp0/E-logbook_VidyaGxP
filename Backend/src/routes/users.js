const express = require('express');
const router = express.Router();
const User = require("../controllers/users");
// const Auth = require("../middlewares/authorization")




router.post('/signup', User.signup);

router.post('/login', User.login);

module.exports = router;