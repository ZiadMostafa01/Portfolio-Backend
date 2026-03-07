const Certificate = require("../models/Certificate");
const fs = require("fs");
const path = require("path");

// 1. Get all certificates sorted by newest first
exports.getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching certificates: " + err.message });
  }
};

// 2. Create a new certificate
exports.createCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Certificate image is required" });
    }

    const newCert = new Certificate({
      title: req.body.title,
      image: `/uploads/${req.file.filename}`,
      issueDate: req.body.issueDate
    });

    await newCert.save();
    res.status(201).json(newCert);
  } catch (err) {
    res.status(500).json({ error: "Error creating certificate: " + err.message });
  }
};

// 3. Update an existing certificate
exports.updateCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Update title if provided
    if (req.body.title) cert.title = req.body.title;
    if (req.body.issueDate) cert.issueDate = req.body.issueDate;

    // Handle image update
    if (req.file) {
      // Delete the old image file from server
      if (cert.image) {
        const oldPath = path.join(__dirname, "..", cert.image);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (e) {
            console.error("Old certificate image deletion failed");
          }
        }
      }
      cert.image = `/uploads/${req.file.filename}`;
    }

    const updatedCert = await cert.save();
    res.json(updatedCert);
  } catch (err) {
    res.status(500).json({ error: "Error updating certificate: " + err.message });
  }
};

// 4. Delete a certificate and its image
exports.deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Delete image file from server
    if (cert.image) {
      const fullPath = path.join(__dirname, "..", cert.image);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.error("Certificate file deletion failed");
        }
      }
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "Certificate and image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting certificate: " + err.message });
  }
};