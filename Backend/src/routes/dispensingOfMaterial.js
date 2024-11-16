const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const DispenseOfMaterial = require("../controllers/DispenseOfMaterial");
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
  "/post",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(1, 1),
  DispenseOfMaterial.InsertDispenseOfMaterialRecord
);

// edit differential pressure elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(1, 1),
  DispenseOfMaterial.EditDispenseOfMaterialRecord
);

// //get a differential pressure elog by id
router.get("/get/:id", Auth.checkUserJwtToken, DispenseOfMaterial.GetDispenseOfMaterialRecord);

// //get all the differential pressure elogs
router.get("/get-all", Auth.checkUserJwtToken, DispenseOfMaterial.GetAllDispenseOfMaterialRecord);

module.exports = router;
