const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const excipientsDispensingController = require("../controllers/excipientsDispensingController")
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

router.post("/Excipients", excipientsDispensingController.createExcipientsDispensing);
router.get("/Excipients/get-all", excipientsDispensingController.getAllExcipientsDispensing);
router.get("/Excipients/:id", excipientsDispensingController.getExcipientsDispensingById);
router.put("/Excipients-update/:id", excipientsDispensingController.updateExcipientsDispensing);
router.delete("/Excipients-delete/:id", excipientsDispensingController.deleteExcipientsDispensing);

module.exports = router;
