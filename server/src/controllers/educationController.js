// controllers/educationController.js

import Advocate from "../models/advocateSchema.js";
import Education from "../models/educationSchema.js";
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
export const updateOrCreateEducations = async (req, res) => {
  try {
    const { advocateId } = req.params;
    const { education } = req.body;

    const educationArray = JSON.parse(education || "[]");

    if (!Array.isArray(educationArray)) {
      return res.status(400).json({ error: "Invalid education data" });
    }

    const advocate = await Advocate.findById(advocateId);
    if (!advocate) {
      return res.status(404).json({ error: "Advocate not found" });
    }

    const savedIds = [];

    for (let i = 0; i < educationArray.length; i++) {
      const edu = educationArray[i];
      const file = req.files?.[i]; // Match by index

      const { _id, degree_title, institution, passing_year } = edu;

      const certificate_url = file ? `/uploads/${file.filename}` : null;

      if (_id) {
        // === UPDATE EXISTING ===
        const existingEdu = await Education.findById(_id);
        if (existingEdu) {
          if (certificate_url && existingEdu.certificate_url) {
            const oldPath = getUploadPath(
              getFilenameFromUrl(existingEdu.certificate_url)
            );
            deleteFile(oldPath);
          }

          existingEdu.degree_title = degree_title;
          existingEdu.institution = institution;
          existingEdu.passing_year = passing_year;
          if (certificate_url) existingEdu.certificate_url = certificate_url;

          await existingEdu.save();
          savedIds.push(existingEdu._id.toString());
        }
      } else {
        // === CREATE NEW ===
        const newEdu = await Education.create({
          degree_title,
          institution,
          passing_year,
          certificate_url,
          user_id: advocate._id,
          user_type: "Advocate",
        });
        savedIds.push(newEdu._id.toString());
      }
    }

    // === REMOVE OLD EDUCATIONS NOT INCLUDED ===
    const previousIds = advocate.education_ids.map(String);
    const toDelete = previousIds.filter((id) => !savedIds.includes(id));

    for (const id of toDelete) {
      const edu = await Education.findById(id);
      if (edu?.certificate_url) {
        const filePath = getUploadPath(getFilenameFromUrl(edu.certificate_url));
        deleteFile(filePath);
      }
      await Education.findByIdAndDelete(id);
    }

    advocate.education_ids = savedIds;
    await advocate.save();

    const educations = await Education.find({ _id: { $in: savedIds } });

    res.status(200).json({
      message: "Education records saved successfully",
      education_ids: savedIds,
      educations,
    });
  } catch (error) {
    console.error("Error updating educations:", error);
    res.status(500).json({ error: "Server error" });
  }
};
