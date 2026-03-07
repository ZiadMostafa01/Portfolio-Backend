const Project = require("../models/Project");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// 1. Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Error fetching projects: " + err.message });
  }
};

// 2. Create a new project with High Quality Processing
exports.createProject = async (req, res) => {
  try {
    const { title, description, githubLink, liveLink, skills, status } = req.body;
    
    let imagePath = "";
    if (req.file) {
      // إنشاء اسم فريد بصيغة webp لأنها الأفضل في الجودة والحجم للمواقع
      const filename = `project-${Date.now()}.webp`;
      const outputPath = path.join(__dirname, "..", "uploads", filename);

      // معالجة الصورة بأعلى إعدادات
      await sharp(req.file.buffer)
        .webp({ quality: 100, lossless: true }) // جودة 100% بدون فقدان بيانات
        .toFile(outputPath);

      imagePath = `/uploads/${filename}`;
    }

    const skillsArray = typeof skills === "string" 
      ? skills.split(",").map(s => s.trim()) 
      : (Array.isArray(skills) ? skills : []);

    const newProject = new Project({
      title,
      description,
      githubLink,
      liveLink,
      status,
      skills: skillsArray,
      image: imagePath
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: "Error creating project: " + err.message });
  }
};

// 3. Update project with High Quality Processing
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const updateData = { ...req.body };

    if (req.body.skills) {
      updateData.skills = typeof req.body.skills === "string" 
        ? req.body.skills.split(",").map(s => s.trim()) 
        : req.body.skills;
    }

    if (req.file) {
      // مسح الصورة القديمة
      if (project.image) {
        const oldPath = path.join(__dirname, "..", project.image);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.error("Old image deletion failed"); }
        }
      }

      // معالجة الصورة الجديدة
      const filename = `updated-${Date.now()}.webp`;
      const outputPath = path.join(__dirname, "..", "uploads", filename);

      await sharp(req.file.buffer)
        .webp({ quality: 100, lossless: true })
        .toFile(outputPath);

      updateData.image = `/uploads/${filename}`;
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { returnDocument: 'after', runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating project: " + err.message });
  }
};

// 4. Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.image) {
      const fullPath = path.join(__dirname, "..", project.image);
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch (e) { console.error("Image deletion failed"); }
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting project: " + err.message });
  }
};