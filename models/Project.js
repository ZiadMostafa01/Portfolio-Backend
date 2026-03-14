const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    type: { type: String, default: "General" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    githubLink: { type: String },
    liveLink: { type: String },
    skills: { type: [String], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", ProjectSchema);
