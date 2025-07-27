import RequestService from "../models/requestServiceSchema.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import serviceSchema from "../models/serviceSchema.js";

// ESM-compatible __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "..", "uploads");
 

// POST /request-service
export const createRequestService = async (req, res) => {
  const clientId = req.user._id;
  let newAttachmentPaths = [];
  try {
    // Handle attachments (PDFs)
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => `/uploads/${file.filename}`);
      newAttachmentPaths = req.files.map(file => path.join(uploadPath, file.filename));
    } else if (req.body.attachments && Array.isArray(req.body.attachments)) {
      attachments = req.body.attachments;
    }

    // Build userMessage object with optional fields
    const userMessageObj = {
      ...req.body.userMessage,
      attachments,
    };
    if (req.body.serviceId) userMessageObj.serviceId = req.body.serviceId;

    const newRequest = await RequestService.create({
      clientId: clientId,
      userMessage: userMessageObj,
      status: "pending",
    });
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    // Cleanup uploaded files if error occurred
    if (newAttachmentPaths && newAttachmentPaths.length > 0) {
      newAttachmentPaths.forEach(filePath => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Failed to create request", error });
  }
}

// GET /request-service
export const getAllRequestServices = async (_req, res) => {
  try {
    console.log("Fetching all request services...");
    const requests = await RequestService
            .find()
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
    console.log(`Updating status for message ID: ${id}`);

    // Step 1: Update AdvocateMessage status
    const updated = await RequestService.findByIdAndUpdate(
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
    console.log(`Updating status for message ID: ${id}`);

    // Step 1: Update AdvocateMessage status
    const updated = await RequestService.findByIdAndUpdate(
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
export const deleteRequestService = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await RequestService.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete request", error });
  }
};
