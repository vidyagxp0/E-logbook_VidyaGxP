const express = require("express");
const router = express.Router();
const User = require("../controllers/users");
const Auth = require("../middlewares/authentication");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../documents/profile_pics/"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

router.post("/admin-login", User.Adminlogin);
router.post(
  "/add-user",
  Auth.checkAdminJwtToken,
  upload.single("profile_pic"),
  User.signup
);
router.put(
  "/edit-user/:id",
  upload.single("profile_pic"),
  Auth.checkAdminJwtToken,
  User.editUser
);
router.delete("/delete-user/:id", Auth.checkAdminJwtToken, User.deleteUser);
router.get("/get-all-users", User.getAllUsers);
router.get("/get-a-user/:id", User.getAUser);
router.get(
  "/get-user-permissions/:id",
  Auth.checkAdminJwtToken,
  User.getUserPermissions
);
router.get("/get-all-rolegroups", User.getAllRoleGroups);
router.post("/user-login", User.Userlogin);

module.exports = router;
