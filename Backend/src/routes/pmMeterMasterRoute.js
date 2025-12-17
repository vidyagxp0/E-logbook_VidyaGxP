const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const pmMeterMasterController = require("../controllers/pmMeterMasterController")
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
    )}`;s
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

router.post("/meter", pmMeterMasterController.createPmMeterMaster);
router.get("/meter/get-all", pmMeterMasterController.getAllPmMeterMaster);
router.get("/meter/:id",pmMeterMasterController.getPmMeterMasterById);
router.put("/meter/:id",pmMeterMasterController.updatePmMeterMaster);
router.delete("/meter/:id",pmMeterMasterController.deletePmMeterMaster);

module.exports = router;
