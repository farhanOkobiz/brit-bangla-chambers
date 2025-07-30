import Document from "../models/documentSchema.js";
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

// === GET DOCUMENTS CONTROLLER ===
export const getDocuments = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Advocate.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Advocate not found" });
    }

    const documents = await Document.find({ user_id: userId });
    res.status(200).json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// === MAIN CONTROLLER ===
export const updateOrCreateDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { documents, documentIndexes } = req.body;

    const documentArray = JSON.parse(documents || "[]");
    let documentIndexesArray = [];
    if (typeof documentIndexes === "string") {
      try {
        documentIndexesArray = JSON.parse(documentIndexes);
      } catch (e) {
        documentIndexesArray = [Number(documentIndexes)];
      }
    } else if (Array.isArray(documentIndexes)) {
      documentIndexesArray = documentIndexes.map(Number);
    } else {
      documentIndexesArray = [];
    }

    if (!Array.isArray(documentArray)) {
      return res.status(400).json({ error: "Invalid document data" });
    }

    const user = await Advocate.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Advocate not found" });
    }

    const savedIds = [];

    for (let i = 0; i < documentArray.length; i++) {
      const doc = documentArray[i];
      let file = null;
      if (documentIndexesArray.length && req.files && req.files.length) {
        const fileIdx = documentIndexesArray.indexOf(i);
        if (fileIdx !== -1 && req.files[fileIdx]) {
          file = req.files[fileIdx];
        }
      }

      const { _id, file_name, document_type, verified } = doc;
      const file_url = file ? `/uploads/${file.filename}` : null;

      if (_id) {
        const existingDoc = await Document.findById(_id);
        if (existingDoc) {
          if (file_url && existingDoc.file_url) {
            const oldPath = getUploadPath(
              getFilenameFromUrl(existingDoc.file_url)
            );
            deleteFile(oldPath);
          }

          existingDoc.file_name = file_name;
          existingDoc.document_type = document_type;
          if (typeof verified === "boolean") existingDoc.verified = verified;
          if (file_url) existingDoc.file_url = file_url;

          await existingDoc.save();
          savedIds.push(existingDoc._id.toString());
        }
      } else {
        const newDoc = await Document.create({
          user_id: userId,
          file_url,
          file_name,
          document_type,
          verified: typeof verified === "boolean" ? verified : true,
        });
        savedIds.push(newDoc._id.toString());
      }
    }

    const previousIds = (user.document_ids || []).map(String);
    const toDelete = previousIds.filter((id) => !savedIds.includes(id));

    for (const id of toDelete) {
      const doc = await Document.findById(id);
      if (doc?.file_url) {
        const filePath = getUploadPath(getFilenameFromUrl(doc.file_url));
        deleteFile(filePath);
      }
      await Document.findByIdAndDelete(id);
    }

    user.document_ids = savedIds;
    await user.save();

    const documentsResult = await Document.find({ _id: { $in: savedIds } });

    res.status(200).json({
      message: "Documents saved successfully",
      document_ids: savedIds,
      documents: documentsResult,
    });
  } catch (error) {
    console.error("Error updating documents:", error);
    res.status(500).json({ error: "Server error" });
  }
};
