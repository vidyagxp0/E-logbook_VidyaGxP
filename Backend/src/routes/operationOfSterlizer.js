const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const OperationOfSterilizer = require("../controllers/OperationOfSterlizer");
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
  OperationOfSterilizer.InsertOperationOfSterilizerForm
);

// edit differential pressure elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(1, 1),
  OperationOfSterilizer.EditOperationOfSterilizerForm
);

// //get a differential pressure elog by id
router.get(
  "/get/:id",
  Auth.checkUserJwtToken,
  OperationOfSterilizer.GettOperationOfSterilizerForm
);

// //get all the differential pressure elogs
router.get(
  "/get-all",
  Auth.checkUserJwtToken,
  OperationOfSterilizer.GetAlltOperationOfSterilizerForm
);

module.exports = router;
