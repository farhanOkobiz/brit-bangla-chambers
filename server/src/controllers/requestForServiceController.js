import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import RequestForService from "../models/requestServiceSchema.js";
import Client from "../models/clientSchema.js";
import User from "../models/userSchema.js";

// ESM-compatible __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "..", "..", "uploads");

// POST /request-service
export const createRequestService = async (req, res) => {
  const clientId = req.user._id;
  let newAttachmentPaths = [];

  try {
    const client = await Client.findOne({ user_id: clientId }).populate(
      "user_id"
    );

    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    const userMessage = {
      name: client.user_id.full_name,
      email: client.user_id.email,
      phone: client?.user_id?.phone,
      nid: client.nid_number,
      presentAddress: client?.present_address,
      permanentAddress: client?.permanent_address,
    };

    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map((file) => `/uploads/${file.filename}`);
      newAttachmentPaths = req.files.map((file) =>
        path.join(uploadPath, file.filename)
      );
    }

    userMessage.attachments = attachments;

    if (req.body.serviceId) {
      userMessage.serviceId = req.body.serviceId;
    }

    const newRequest = await RequestForService.create({
      clientId,
      userMessage,
      status: "pending",
    });

    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    if (newAttachmentPaths.length > 0) {
      newAttachmentPaths.forEach((filePath) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create request",
      error: error.message,
    });
  }
};

// GET /request-service
export const getAllRequestServices = async (_req, res) => {
  try {
    const requests = await RequestForService.find()
      .populate("userMessage.serviceId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch requests", error });
  }
};

export const acceptedRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    // Step 1: Update AdvocateMessage status
    const updated = await RequestForService.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "request failed" });
    }
    res.status(200).json({
      message: "Status updated successfully",
      advocateMessage: updated,
      // requestService: requestUpdate,
    });
  } catch (error) {
    console.error("Failed to update status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// Reject:
export const rejectedRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Update AdvocateMessage status
    const updated = await RequestForService.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Step 2: Also update related requestService status
    // const requestUpdate = await RequestService.findByIdAndUpdate(
    //   updated.userMessageId, // userMessage holds the requestId
    //   {
    //     status: "rejected",
    //   },
    //   { new: true }
    // );

    res.status(200).json({
      message: "Status updated successfully",
      advocateMessage: updated,
      // requestService: requestUpdate,
    });
  } catch (error) {
    console.error("Reject error:", error);
    res.status(500).json({ message: "Failed to reject user message" });
  }
};

// DELETE /request-service/:id
// DELETE /request-service/:id
// DELETE /request-service/:id
// DELETE /request-service/:id
// DELETE /request-service/:id
export const deleteRequestService = async (req, res) => {
  try {
    const { id } = req.params;
    if (fs.existsSync(uploadPath)) {
      const filesBeforeDB = fs.readdirSync(uploadPath);
    }

    // Find the request first to get the attachment paths
    const deleted = await RequestForService.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    // Check files again after database lookup
    if (fs.existsSync(uploadPath)) {
      const filesAfterDB = fs.readdirSync(uploadPath);
    }

    // Remove uploaded attachments from filesystem
    const attachments = deleted.userMessage?.attachments || [];

    if (attachments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Request deleted (no attachments to remove)",
      });
    }

    let deletedFiles = [];
    let failedFiles = [];

    attachments.forEach((filePath) => {
      // Handle different possible formats
      let filename;
      if (filePath.startsWith("/uploads/")) {
        filename = filePath.replace("/uploads/", "");
      } else if (filePath.startsWith("uploads/")) {
        filename = filePath.replace("uploads/", "");
      } else {
        filename = filePath; // Assume it's just the filename
      }

      const fullPath = path.join(uploadPath, filename);

      // Normalize the path for Windows
      const normalizedPath = path.normalize(fullPath);

      if (fs.existsSync(normalizedPath)) {
        try {
          fs.unlinkSync(normalizedPath);
          deletedFiles.push(filename);
        } catch (unlinkError) {
          console.error("❌ Error deleting file:", unlinkError);
          failedFiles.push({ filename, error: unlinkError.message });
        }
      } else {
        failedFiles.push({ filename, error: "File not found" });

        // Show what files ARE in the directory
        if (fs.existsSync(uploadPath)) {
          const currentFiles = fs.readdirSync(uploadPath);

          // Check for partial matches
          const partialMatches = currentFiles.filter(
            (file) =>
              file.includes(filename.split("-")[0]) || // Check prefix
              filename.includes(file.split("-")[0]) // Reverse check
          );
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Request deleted",
      deletedFiles,
      failedFiles,
    });
  } catch (error) {
    console.error("Delete request error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete request", error });
  }
};
