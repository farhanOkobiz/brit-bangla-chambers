import Certification from "../models/certificationSchema.js";
import Advocate from "../models/advocateSchema.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helpers
const getFilenameFromUrl = (url) => {
  const parts = url.split("/uploads/");
  return parts.length > 1 ? parts[1] : null;
};

const getUploadPath = (filename) => {
  return path.join(__dirname, "..", "..", "uploads", filename);
};

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Deleted file:", filePath);
    }
  } catch (err) {
    console.error("File delete error:", err);
  }
};

// === MAIN CONTROLLER ===
export const updateOrCreateCertifications = async (req, res) => {
  console.log("hit certification controller");
  try {
    const { advocateId } = req.params;
    const { certifications } = req.body;

    const certificationArray = JSON.parse(certifications || "[]");

    if (!Array.isArray(certificationArray)) {
      return res.status(400).json({ error: "Invalid certification data" });
    }

    const advocate = await Advocate.findById(advocateId);
    if (!advocate) {
      return res.status(404).json({ error: "Advocate not found" });
    }

    const savedIds = [];

    for (let i = 0; i < certificationArray.length; i++) {
      const cert = certificationArray[i];
      const file = req.files?.[i]; // Match by index

      const { _id, title, issuer, year, certificate_type, description } = cert;

      const certificate_url = file ? `/uploads/${file.filename}` : null;

      if (_id) {
        // === UPDATE EXISTING ===
        const existingCert = await Certification.findById(_id);
        if (existingCert) {
          if (certificate_url && existingCert.certificate_url) {
            const oldPath = getUploadPath(
              getFilenameFromUrl(existingCert.certificate_url)
            );
            deleteFile(oldPath);
          }

          existingCert.title = title;
          existingCert.issuer = issuer;
          existingCert.year = year;
          existingCert.certificate_type = certificate_type;
          existingCert.description = description;
          if (certificate_url) existingCert.certificate_url = certificate_url;

          await existingCert.save();
          savedIds.push(existingCert._id.toString());
        }
      } else {
        // === CREATE NEW ===
        const newCert = await Certification.create({
          advocate_id: advocate._id,
          title,
          issuer,
          year,
          certificate_type,
          certificate_url,
          description,
        });
        savedIds.push(newCert._id.toString());
      }
    }

    // === REMOVE OLD CERTIFICATIONS NOT INCLUDED ===
    const previousIds = advocate.certification_ids.map(String);
    const toDelete = previousIds.filter((id) => !savedIds.includes(id));

    for (const id of toDelete) {
      const cert = await Certification.findById(id);
      if (cert?.certificate_url) {
        const filePath = getUploadPath(
          getFilenameFromUrl(cert.certificate_url)
        );
        deleteFile(filePath);
      }
      await Certification.findByIdAndDelete(id);
    }

    advocate.certification_ids = savedIds;
    await advocate.save();

    const certificationsResult = await Certification.find({
      _id: { $in: savedIds },
    });

    res.status(200).json({
      message: "Certifications saved successfully",
      certification_ids: savedIds,
      certifications: certificationsResult,
    });
  } catch (error) {
    console.error("Error updating certifications:", error);
    res.status(500).json({ error: "Server error" });
  }
};
