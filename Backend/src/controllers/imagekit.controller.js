
const imagekit = require("../config/imagekit");

const uploadImageToImageKit = async (req, res) => {
  try {


    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }


    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message:
          "Only JPG, PNG, WEBP and AVIF images are allowed.",
      });
    }

    if (req.file.size > 25 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Image must be smaller than 25MB.",
      });
    }

    /* =========================
       SAFE FILE NAME
    ========================= */

    const safeFileName = req.file.originalname
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    const fileName = `${Date.now()}-${safeFileName}`;

    /* =========================
       UPLOAD TO IMAGEKIT
    ========================= */

    const result = await imagekit.files.upload({
      file: req.file.buffer,
      fileName,
      folder: "/aurevyn/products",
      useUniqueFileName: true,
    });

    if (!result?.url) {
      throw new Error(
        "ImageKit did not return an image URL.",
      );
    }

    console.log("ImageKit upload successful:", {
      fileId: result.fileId,
      filePath: result.filePath,
      url: result.url,
    });

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      image: {
        url: result.url,
        fileId: result.fileId,
        filePath: result.filePath,
        name: result.name,
        width: result.width,
        height: result.height,
        thumbnailUrl: result.thumbnailUrl,
      },
    });
  } catch (error) {
    console.error(
      "ImageKit server upload error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to upload image to ImageKit.",
    });
  }
};

module.exports = {
  uploadImageToImageKit,
};

