const express = require("express");
const multer = require("multer");

const protect = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");

const { uploadImageToImageKit } = require("../controllers/imagekit.controller");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 25 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPG, PNG, WEBP and AVIF images are allowed."),
      );
    }

    callback(null, true);
  },
});

router.post(
  "/upload",
  protect,
  requireRole("admin"),
  upload.single("image"),
  uploadImageToImageKit,
);

module.exports = router;
