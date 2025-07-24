import CaseFile from "../models/caseFileSchema.js";

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
export const getAllCaseFiles = async (req, res) => {
  try {
    const caseFiles = await CaseFile.find().populate("advocate_id client_id");
    res.status(200).json({ success: true, data: caseFiles });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cases",
      error: error.message,
    });
  }
};

// ✅ Get Single Case File by ID
export const getCaseFileById = async (req, res) => {
  try {
    const caseFile = await CaseFile.findById(req.params.id).populate(
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

// ✅ Update Case File
export const updateCaseFile = async (req, res) => {
  try {
    const updated = await CaseFile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

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
