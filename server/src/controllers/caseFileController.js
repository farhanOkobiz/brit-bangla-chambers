import CaseFile from "../models/caseFileSchema.js";
import { Notification } from "../models/notificationSchema.js";

// ✅ Create Case File
export const createCaseFile = async (req, res) => {
  const advocateId = req.user.id;

  try {
    const caseFile = await CaseFile.create({
      ...req.body,
      advocate_id: advocateId,
    });
    res.status(201).json({ success: true, data: caseFile });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create case",
      error: error.message,
    });
  }
};

// ✅ Get All Case Files
export const getAllCaseFilesForAdvocate = async (req, res) => {
  try {
    const id = req?.user?.id;

    const caseFiles = await CaseFile.find({ advocate_id: id }).populate(
      "advocate_id"
    );

    res.status(200).json({ success: true, data: caseFiles });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cases",
      error: error.message,
    });
  }
};

// ✅ Get All Case Files
export const getAllCaseFilesForAdmin = async (req, res) => {
  try {
    const caseFiles = await CaseFile.find().populate("advocate_id");

    res.status(200).json({ success: true, data: caseFiles });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cases",
      error: error.message,
    });
  }
};

// ✅ Get Single Case File
export const getCaseFileForClient = async (req, res) => {
  try {
    const client_id = req?.user?.id;

    const caseFile = await CaseFile.find({ client_id: client_id }).populate(
      "advocate_id client_id"
    );
    if (!caseFile) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    res.status(200).json({ success: true, data: caseFile });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch case",
      error: error.message,
    });
  }
};

// ✅ Get Single Case File by id for details
export const getSingleCaseFileById = async (req, res) => {
  try {
    const id = req?.params?.id;

    const caseFile = await CaseFile.findById(id).populate("advocate_id");
    if (!caseFile) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    res.status(200).json({ success: true, data: caseFile });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch case",
      error: error.message,
    });
  }
};

// ✅ Update Case File
export const updateCaseFile = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const updated = await CaseFile.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    // 🔔
    await Notification.create({
      userId: updated.client_id,
      title: "Your case has been updated",
      message: `Your case "${updated.title}" has been updated with new information.`,
      relatedCaseId: updated._id,
      case_number: updated.case_number,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update case",
      error: error.message,
    });
  }
};

// ✅ Delete Case File
export const deleteCaseFile = async (req, res) => {
  try {
    const deleted = await CaseFile.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Case deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete case",
      error: error.message,
    });
  }
};

export const addDocumentToCaseFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentTitle, documentUrls } = req.body;

    // Validate input
    if (!documentTitle || !documentUrls || !Array.isArray(documentUrls)) {
      return res.status(400).json({
        success: false,
        message: "Document title and URLs array are required",
      });
    }

    // Find case file
    const caseFile = await CaseFile.findById(id);
    if (!caseFile) {
      return res.status(404).json({
        success: false,
        message: "Case file not found",
      });
    }

    // Find existing document group with same title
    const existingDocGroup = caseFile.documents.find(
      (doc) => doc.documentTitle === documentTitle
    );

    if (existingDocGroup) {
      // Add to existing group
      existingDocGroup.documentUrl.push(...documentUrls);
    } else {
      // Create new document group
      caseFile.documents.push({
        documentTitle,
        documentUrl: documentUrls,
      });
    }

    // Save updates
    const updatedCaseFile = await caseFile.save();

    res.status(201).json({
      success: true,
      message: "Document added successfully",
      caseFile: updatedCaseFile,
    });
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding document",
    });
  }
};

export const changeCaseFileStatus = async (req, res) => {
  console.log("hit api change case file status")
  try {
    const { id } = req.params;
    const { status } = req.body  // Handle undefined req.body

    console.log("id: ", id)

    // Check if status exists
    if (status === undefined || status === null) {
      return res.status(400).json({
        success: false,
        message: "Status field is required in request body",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Case file ID is required",
      });
    }

    const updatedCaseFile = await CaseFile.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedCaseFile) {
      return res.status(404).json({
        success: false,
        error: "Case file not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCaseFile,
      message: "Case file status updated successfully",
    });
  } catch (error) {
    console.error("Error updating case file status:", error);

    const statusCode = error.name === "ValidationError" ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
      errorType: error.name,
    });
  }
};
