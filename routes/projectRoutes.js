const express = require("express");
const router = express.Router();
const multer = require("multer");
const projectCtrl = require("../controllers/projectController");

// استخدام Memory Storage لمعالجة الصورة قبل حفظها
const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 } // رفع الحد لـ 10 ميجا لصور الجودة العالية
});

router.get("/", projectCtrl.getProjects);
router.post("/", upload.single("image"), projectCtrl.createProject);
router.put("/:id", upload.single("image"), projectCtrl.updateProject);
router.delete("/:id", projectCtrl.deleteProject);

module.exports = router;