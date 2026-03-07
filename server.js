const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dns = require("dns");
require("dotenv").config();

// 1. حل مشكلة الـ DNS للاتصال بـ MongoDB Atlas
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// 2. Middlewares الأساسية
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// 3. إعداد المجلدات الثابتة (Static Files)
// ملاحظة: المجلد ده هيكون للقراءة فقط بعد الرفع على Vercel
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 4. الاتصال بقاعدة البيانات MongoDB
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in .env file");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));
}

// 5. تعريف المسارات (Routes)
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));

// مسار تجريبي للتأكد أن السيرفر يعمل
app.get("/", (req, res) => {
  res.send("Backend is running successfully on Vercel!");
});

// 6. التعامل مع المسارات غير الموجودة (404)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 7. تشغيل السيرفر محلياً فقط
// Vercel لا يستخدم app.listen بل يستخدم الـ export
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running locally on: http://localhost:${PORT}`);
    });
}

// 8. تصدير التطبيق (مهم جداً لـ Vercel)
module.exports = app;