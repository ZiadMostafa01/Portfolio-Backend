const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const certCtrl = require("../controllers/certificateController");

// إعداد التخزين للصور الخاصة بالشهادات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // تسمية الملف بـ timestamp لتجنب تكرار الأسماء
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // حد أقصى 5 ميجا بايت
});

// --- المسارات (Routes) ---

// 1. جلب كل الشهادات
router.get("/", certCtrl.getCertificates);

// 2. إضافة شهادة جديدة (تحتاج رفع صورة)
router.post("/", upload.single("image"), certCtrl.createCertificate);

// 3. تحديث شهادة (اختياري رفع صورة جديدة)
router.put("/:id", upload.single("image"), certCtrl.updateCertificate);

// 4. حذف شهادة
router.delete("/:id", certCtrl.deleteCertificate);

module.exports = router;