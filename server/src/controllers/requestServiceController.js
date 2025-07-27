import RequestService from "../models/requestServiceSchema.js";

// POST /request-service
export const createRequestService = async (req, res) => {
  const clientId = req.user._id;

  try {
     console.log("Creating new request:", req.body)
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

    // Step 2: Also update related requestService status
    // const requestUpdate = await RequestService.findByIdAndUpdate(
    //   updated.userMessageId, // userMessage holds the requestId
    //   {
    //     status: "accepted",
    //   },
    //   { new: true }
    // );

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
