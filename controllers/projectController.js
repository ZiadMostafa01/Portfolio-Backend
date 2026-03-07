const Project = require("../models/Project");

// 1. Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Error fetching projects: " + err.message });
  }
};

// 2. Create a new project (Cloudinary version)
exports.createProject = async (req, res) => {
  try {
    const { title, description, githubLink, liveLink, skills, status } = req.body;
    
    // req.file.path هنا هو لينك الصورة المباشر من Cloudinary
    const imagePath = req.file ? req.file.path : "";

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

// 3. Update project (Cloudinary version)
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
      // تحديث اللينك بـ لينك Cloudinary الجديد
      updateData.image = req.file.path;
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
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

    // بنحذف السجل من MongoDB (الصورة بتفضل في Cloudinary كأرشيف)
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting project: " + err.message });
  }
};