const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  githubLink: { type: String },
  liveLink: { type: String },
  status: { type: String, default: "Under Development" },
  skills: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);