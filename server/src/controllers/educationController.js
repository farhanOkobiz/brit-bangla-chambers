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

export const getEducationsByAdvocate = async (req, res) => {
  try {
    const { advocateId } = req.params;
    const advocate = await Advocate.findById(advocateId);
    if (!advocate) {
      return res.status(404).json({ error: "Advocate not found" });
    }
    const educations = await Education.find({ advocate_id: advocate._id });
    res.status(200).json({ educations });
  } catch (error) {
    console.error("Error fetching educations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// === MAIN CONTROLLER ===
export const updateOrCreateEducations = async (req, res) => {
  try {
    const { advocateId } = req.params;
    const { education, educationIndexes } = req.body;
    const educationArray = JSON.parse(education || "[]");
    // Parse educationIndexes from req.body (may be string or array)
    let educationIndexesArray = [];
    if (typeof educationIndexes === "string") {
      try {
        educationIndexesArray = JSON.parse(educationIndexes);
      } catch (e) {
        educationIndexesArray = [Number(educationIndexes)];
      }
    } else if (Array.isArray(educationIndexes)) {
      educationIndexesArray = educationIndexes.map(Number);
    } else {
      educationIndexesArray = [];
    }

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
      // Find file for this education by index
      let file = null;
      if (educationIndexesArray.length && req.files && req.files.length) {
        const fileIdx = educationIndexesArray.indexOf(i);
        if (fileIdx !== -1 && req.files[fileIdx]) {
          file = req.files[fileIdx];
        }
      }

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
          advocate_id: advocate._id,
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
