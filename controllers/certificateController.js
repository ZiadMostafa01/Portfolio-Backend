const Certificate = require("../models/Certificate");

// 1. Get all certificates
exports.getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching certificates: " + err.message });
  }
};

// 2. Create a new certificate (Cloudinary version)
exports.createCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Certificate image is required" });
    }

    const newCert = new Certificate({
      title: req.body.title,
      image: req.file.path, // لينك Cloudinary المباشر
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

    if (req.body.title) cert.title = req.body.title;
    if (req.body.issueDate) cert.issueDate = req.body.issueDate;

    if (req.file) {
      cert.image = req.file.path; // تحديث للينك الجديد
    }

    const updatedCert = await cert.save();
    res.json(updatedCert);
  } catch (err) {
    res.status(500).json({ error: "Error updating certificate: " + err.message });
  }
};

// 4. Delete a certificate
exports.deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "Certificate deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting certificate: " + err.message });
  }
};