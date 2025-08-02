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
    const { documentUrl, documentTitle } = req.body;
    console.log("hit add document to case file:", documentUrl, documentTitle);

    const caseFile = await CaseFile.findById(id);
    if (!caseFile) {
      return res.status(404).json({ error: "Case file not found" });
    }

    caseFile.documents.push(documentUrl);
    caseFile.documentTitle = documentTitle;
    await caseFile.save();
    const caseFile2 = await CaseFile.findById(id);

    console.log("caseFile2: ", caseFile2);

    res.status(200).json({ success: true, data: caseFile });
  } catch (error) {
    console.error("Error adding document to case file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
