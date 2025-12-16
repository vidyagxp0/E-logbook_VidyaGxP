const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const apiIndentificationController = require("../controllers/apiIndentificationController")
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

router.post("/identification", apiIndentificationController.createIdentification);
router.get("/identification/get-all", apiIndentificationController.getAllIdentification);
router.get("/identification/:id", apiIndentificationController.getIdentificationById);
router.put("/identification/:id", apiIndentificationController.updateIdentification);
router.delete("/identification/:id", apiIndentificationController.deleteIdentification);

module.exports = router;
