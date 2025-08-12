// controllers/fileRequestController.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { FileRequest } from "../models/fileRequestSchema.js";
import { Notification } from "../models/notificationSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Helper: Extracts filename from URL path
const getFilenameFromUrl = (url) => {
  const parts = url.split("/uploads/");
  return parts.length > 1 ? parts[1] : null;
};

// ✅ Helper: Gets full path to uploaded file
const getUploadPath = (filename) => {
  return path.join(__dirname, "..", "..", "uploads", filename);
};

// ✅ Helper: Deletes uploaded file safely
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("File delete error:", error);
  }
};

// CREATE
export const createFileRequest = async (req, res) => {
  console.log("hit api create file request", req.body);
  try {
    const {
      client_id,
      advocate_id,
      case_id,
      title,
      description,
      case_number,
      documentTitle,
    } = req.body;
    const files = req.files;

    if (!client_id || !advocate_id || !case_number) {
      if (files?.length) {
        files.forEach((file) => deleteFile(getUploadPath(file.filename)));
      }
      return res
        .status(400)
        .json({ error: "Client and Advocate IDs are required." });
    }

    // Prepare documents array
    let documents = [];
    if (files?.length) {
      files.forEach((file) => {
        documents.push({
          documentTitle: documentTitle || "Documents",
          documentUrl: `/uploads/${file.filename}`,
        });
      });
    }

    const newRequest = await FileRequest.create({
      client_id,
      advocate_id,
      title,
      case_id,
      case_number,
      description,
      documents,
    });
    console.log("New file request created:", newRequest);

    // 🔔
    await Notification.create({
      userId: client_id,
      title: "Documents Needed for Your Case",
      message: `Your assigned advocate has requested some documents related to your case. Please log in and complete the submission.`,
      relatedCaseId: case_id,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating file request:", error);
    if (req.files?.length) {
      req.files.forEach((file) => deleteFile(getUploadPath(file.filename)));
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE
export const updateFileRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_id, advocate_id, title, description, documentTitle } =
      req.body;
    const files = req.files;

    const existing = await FileRequest.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "File request not found." });
    }

    // If new files uploaded, add as new document groups
    if (files?.length) {
      files.forEach((file) => {
        existing.documents.push({
          documentTitle: documentTitle || "Documents",
          documentUrl: `/uploads/${file.filename}`,
        });
      });
    }

    // Update other fields
    existing.client_id = client_id || existing.client_id;
    existing.advocate_id = advocate_id || existing.advocate_id;
    existing.title = title || existing.title;
    existing.description = description || existing.description;

    await existing.save();

    res.status(200).json(existing);
  } catch (error) {
    console.error("Error updating file request:", error);
    if (req.files?.length) {
      req.files.forEach((file) => deleteFile(getUploadPath(file.filename)));
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// For client: upload file(s) to existing request
export const uploadFilesToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    const { documentTitle } = req.body;

    if (!files?.length) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    if (!documentTitle || documentTitle.trim() === "") {
      files.forEach((file) => deleteFile(getUploadPath(file.filename)));
      return res.status(400).json({
        success: false,
        message: "Document title is required",
      });
    }

    if (!documentTitle || documentTitle.trim() === "") {
      files.forEach((file) => deleteFile(getUploadPath(file.filename)));
      return res.status(400).json({ error: "Document title is required." });
    }

    const existing = await FileRequest.findById(id);
    if (!existing) {
      files.forEach((file) => deleteFile(getUploadPath(file.filename)));
      return res.status(404).json({ error: "File request not found." });
    }

    // Add new document group with all uploaded files
    existing.documents.push({
      documentTitle: documentTitle.trim(),
      documentUrl: files.map((file) => `/uploads/${file.filename}`),
    });

    await existing.save();

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      data: existing,
    });
  } catch (error) {
    console.error("Client file upload error:", error);

    if (req.files?.length) {
      req.files.forEach((file) => deleteFile(getUploadPath(file.filename)));
    }

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAllFileRequests = async (req, res) => {
  try {
    const { client_id, advocate_id } = req.query;

    const filter = {};
    if (client_id) filter.client_id = client_id;
    if (advocate_id) filter.advocate_id = advocate_id;

    const requests = await FileRequest.find(filter)
      .populate("client_id", "full_name email")
      .populate("advocate_id", "full_name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching file requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFileRequestByClintId = async (req, res) => {
  try {
    const { _id } = req.user;

    const request = await FileRequest.find({ client_id: _id });

    if (!request) {
      return res.status(404).json({ error: "File request not found." });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching file request by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getFileRequestByCaseId = async (req, res) => {
  try {
    const { _id } = req.params;

    const request = await FileRequest.findOne({ case_id: _id })
      .populate("client_id", "full_name email")
      .populate("advocate_id", "full_name email");

    console.log("reques: ", request);

    if (!request) {
      return res.status(404).json({ error: "File request not found." });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching file request by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteFileRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const fileRequest = await FileRequest.findById(id);
    if (!fileRequest) {
      return res.status(404).json({ error: "File request not found." });
    }

    // 🔥 Delete all uploaded files
    if (fileRequest.file_url?.length) {
      fileRequest.file_url.forEach((url) => {
        const filename = getFilenameFromUrl(url);
        if (filename) {
          deleteFile(getUploadPath(filename));
        }
      });
    }

    await FileRequest.findByIdAndDelete(id);

    res.status(200).json({ message: "File request deleted successfully." });
  } catch (error) {
    console.error("Error deleting file request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE a specific file from file_url array
export const deleteSingleDocumentsFromRequest = async (req, res) => {
  console.log("Deleting single document from request...");
  try {
    const { _id } = req.params;
    const { file_url } = req.body; // The file URL to delete

    if (!_id || !file_url) {
      return res.status(400).json({
        message: "Request ID and file URL are required.",
      });
    }

    const fileRequest = await FileRequest.findById(_id);
    if (!fileRequest) {
      return res.status(404).json({ message: "File request not found." });
    }

    let fileFound = false;

    // Loop through document groups to find and remove the file
    fileRequest.documents.forEach((docGroup) => {
      const initialLength = docGroup.documentUrl.length;
      docGroup.documentUrl = docGroup.documentUrl.filter(
        (url) => url !== file_url
      );
      if (docGroup.documentUrl.length < initialLength) {
        fileFound = true;
        // Delete the physical file
        const filename = getFilenameFromUrl(file_url);
        if (filename) {
          deleteFile(getUploadPath(filename));
        }
      }
    });

    // Remove document groups that now have no files
    fileRequest.documents = fileRequest.documents.filter(
      (docGroup) => docGroup.documentUrl.length > 0
    );

    if (!fileFound) {
      return res
        .status(404)
        .json({ message: "File URL not found in this request." });
    }

    await fileRequest.save();

    res.status(200).json({
      message: "File deleted successfully.",
      success: true,
      fileRequest,
    });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({
      message: "Server error while deleting file.",
    });
  }
};
