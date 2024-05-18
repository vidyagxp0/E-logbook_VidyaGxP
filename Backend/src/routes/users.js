const express = require('express');
const router = express.Router();
const User = require("../controllers/users");
const Auth = require("../middlewares/authentication")




router.post('/admin-login', User.Adminlogin);
router.post('/add-user', Auth.checkAdminJwtToken, User.signup);
router.put('/edit-user/:id', Auth.checkAdminJwtToken, User.editUser);
router.delete('/delete-user/:id', Auth.checkAdminJwtToken, User.deleteUser);
router.post('/user-login', User.Userlogin);


module.exports = router;