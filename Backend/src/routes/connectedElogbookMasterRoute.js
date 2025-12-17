const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const connectedElogbookController = require("../controllers/connectedElogbookController")
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

router.post("/connected", connectedElogbookController.createConnectedElogbook);
router.get("/connected/get-all", connectedElogbookController.getAllConnectedElogbook);
router.get("/connected/:id", connectedElogbookController.getConnectedElogbookById);
router.put("/connected/:id", connectedElogbookController.updateConnectedElogbook);
router.delete("/connected/:id", connectedElogbookController.deleteConnectedElogbook);

module.exports = router;
