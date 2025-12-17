const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const personInvolvedController = require("../controllers/personInvolvedController")
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

router.post("/Involved", personInvolvedController.createPersonInvolved);
router.get("/Involved/get-all", personInvolvedController.getAllPersonInvolved);
router.get("/Involved/:id", personInvolvedController.getPersonInvolvedById);
router.put("/Involved-update/:id", personInvolvedController.updatePersonInvolved);
router.delete("/Involved-delete/:id", personInvolvedController.deletePersonInvolved);

module.exports = router;
