import CaseFile from "../models/caseFileSchema.js";

export const getSomeInfoFromCaseFile = async (req, res) => {
  try {
    const client_id = req?.user?.id;

    const caseFiles = await CaseFile.find(
      { client_id: client_id },
      { next_hearing_date: 1, verdict_date: 1, _id: 0 }
    );

    const caseCount = await CaseFile.countDocuments({ client_id: client_id });

    res.status(200).json({
      success: true,
      totalCases: caseCount,
      hearingAndVerdictDates: caseFiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch case",
      error: error.message,
    });
  }
};
