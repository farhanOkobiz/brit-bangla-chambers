// controllers/fileRequestController.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { FileRequest } from "../models/fileRequestSchema.js";

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
      console.log("Deleted file:", filePath);
    }
  } catch (error) {
    console.error("File delete error:", error);
  }
};

// ✅ Controller: Creates a new file/documentation request
// controllers/fileRequestController.js

export const createFileRequest = async (req, res) => {
    console.log("hit create file request:", req.body);
  try {
    const { client_id, advocate_id, title, description } = req.body;
    const files = req.files;

    if (!client_id || !advocate_id) {
      if (files?.length) {
        files.forEach(file => deleteFile(getUploadPath(file.filename)));
      }
      return res.status(400).json({ error: "Client and Advocate IDs are required." });
    }

    const file_urls = files?.length ? files.map(file => `/uploads/${file.filename}`) : [];

    const newRequest = await FileRequest.create({
      client_id,
      advocate_id,
      title,
      description,
      file_url: file_urls,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating file request:", error);
    if (req.files?.length) {
      req.files.forEach(file => deleteFile(getUploadPath(file.filename)));
    }
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateFileRequest = async (req, res) => {
  console.log("hit update file request:", req.body);
  try {
    const { id } = req.params;
    const { client_id, advocate_id, title, description } = req.body;
    const files = req.files;

    const existing = await FileRequest.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "File request not found." });
    }

    // 🔥 Delete old files if new ones uploaded
    if (files?.length && existing.file_url?.length) {
      existing.file_url.forEach((url) => {
        const filename = getFilenameFromUrl(url);
        if (filename) {
          deleteFile(getUploadPath(filename));
        }
      });
    }

    const updatedData = {
      client_id: client_id || existing.client_id,
      advocate_id: advocate_id || existing.advocate_id,
      title: title || existing.title,
      description: description || existing.description,
      file_url: files?.length
        ? files.map((file) => `/uploads/${file.filename}`)
        : existing.file_url,
    };

    const updatedRequest = await FileRequest.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    );

    res.status(200).json(updatedRequest);
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

    if (!files?.length) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    const existing = await FileRequest.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "File request not found." });
    }

    // Optionally: delete old files first
    if (existing.file_url?.length) {
      existing.file_url.forEach((url) => {
        const filename = getFilenameFromUrl(url);
        if (filename) {
          deleteFile(getUploadPath(filename));
        }
      });
    }

    const newFileUrls = files.map(file => `/uploads/${file.filename}`);

    const updated = await FileRequest.findByIdAndUpdate(
      id,
      { file_url: newFileUrls },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Client file upload error:", error);
    req.files?.forEach(file => deleteFile(getUploadPath(file.filename)));
    res.status(500).json({ error: "Internal server error" });
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

export const getFileRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await FileRequest.findById(id)
      .populate("client_id", "full_name email")
      .populate("advocate_id", "full_name email");

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
