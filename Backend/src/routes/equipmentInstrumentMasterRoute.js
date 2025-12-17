const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const equipmentInstrumentMasterController = require("../controllers/equipmentInstrumentMasterController")
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

router.post("/equipment", equipmentInstrumentMasterController.createEquipmentInstrument);
router.get("/equipment/get-all", equipmentInstrumentMasterController.getAllEquipmentInstrument);
router.get("/equipment/:id", equipmentInstrumentMasterController.getEquipmentInstrumentById );
router.put("/equipment/:id", equipmentInstrumentMasterController.updateEquipmentInstrument);
router.delete("/equipment/:id", equipmentInstrumentMasterController.deleteEquipmentInstrument);

module.exports = router;