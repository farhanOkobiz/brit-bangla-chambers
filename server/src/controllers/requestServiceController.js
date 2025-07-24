import RequestService from "../models/requestServiceSchema.js";

// POST /request-service
export const createRequestService = async (req, res) => {
  const clientId = req.user._id;

  try {
    const newRequest = await RequestService.create({
      ...req.body,
      clientId: clientId,
    });
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create request", error });
  }
};

// GET /request-service
export const getAllRequestServices = async (_req, res) => {
  try {
    const requests = await RequestService.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch requests", error });
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
