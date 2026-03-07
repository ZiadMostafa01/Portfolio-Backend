const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    issueDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Certificate", certificateSchema);