const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const projectCtrl = require("../controllers/projectController");

// 1. إعدادات Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. إعداد المخزن للمشاريع
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio_projects", // فولدر مختلف عشان تنظم صورك
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

// 3. المسارات
router.get("/", projectCtrl.getProjects);
router.post("/", upload.single("image"), projectCtrl.createProject);
router.put("/:id", upload.single("image"), projectCtrl.updateProject);
router.delete("/:id", projectCtrl.deleteProject);

module.exports = router;