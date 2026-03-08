const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const certCtrl = require("../controllers/certificateController");

// 1. إعداد إعدادات Cloudinary (تأكد إن الأسامي دي هي اللي في الـ .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. إعداد المخزن (Storage) ليرفع مباشرة على سحابة Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "certificates", // اسم الفولدر اللي هيتعمل في حسابك على كلاوديناري
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

// --- المسارات (Routes) ---

// جلب كل الشهادات
router.get("/", certCtrl.getCertificates);

// إضافة شهادة (الآن الصورة هتروح لكلاوديناري واللينك هيرجع في req.file.path)
router.post("/", upload.single("image"), certCtrl.createCertificate);

// تحديث شهادة
router.put("/:id", upload.single("image"), certCtrl.updateCertificate);

// حذف شهادة
router.delete("/:id", certCtrl.deleteCertificate);

module.exports = router;