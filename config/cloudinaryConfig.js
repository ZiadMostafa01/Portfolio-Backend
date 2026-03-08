const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// إعدادات كلاوديناري (تأكد إن البيانات دي في الـ .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio_projects",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

// الحين الـ post والـ put هيشتغلوا صح مع الـ controller بتاعك
router.post("/", upload.single("image"), projectCtrl.createProject);