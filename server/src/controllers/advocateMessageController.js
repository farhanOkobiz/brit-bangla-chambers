import AdvocateMessage from "../../src/models/AdvocateMessageSchema.js";
import RequestService from "../../src/models/requestServiceSchema.js";

export const createAdvocateMessage = async (req, res) => {
  try {
    const { userMessage, userMessageId, advocateId } = req.body;

    if (!userMessage || !userMessageId || !advocateId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMessage = new AdvocateMessage({
      userMessage,
      advocateId,
      userMessageId,
      status: "pending",
    });

    await newMessage.save();

    // update requestService to mark as forwarded
    await RequestService.findByIdAndUpdate(userMessageId, {
      adminForwarded: true,
      forwardedTo: advocateId,
      status: "sent_to_advocate",
    });

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error creating advocate message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdvocateMessage = async (req, res) => {
  try {
    const messages = await AdvocateMessage.find();

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Accept: Update status to true
export const acceptedMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating status for message ID: ${id}`);

    // Step 1: Update AdvocateMessage status
    const updated = await AdvocateMessage.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Step 2: Also update related requestService status
    const requestUpdate = await RequestService.findByIdAndUpdate(
      updated.userMessageId, // userMessage holds the requestId
      {
        status: "accepted",
      },
      { new: true }
    );

    res.status(200).json({
      message: "Status updated successfully",
      advocateMessage: updated,
      requestService: requestUpdate,
    });
  } catch (error) {
    console.error("Failed to update status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// Reject: Delete message
export const rejectedMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating status for message ID: ${id}`);

    // Step 1: Update AdvocateMessage status
    const updated = await AdvocateMessage.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Step 2: Also update related requestService status
    const requestUpdate = await RequestService.findByIdAndUpdate(
      updated.userMessageId, // userMessage holds the requestId
      {
        status: "rejected",
      },
      { new: true }
    );

    res.status(200).json({
      message: "Status updated successfully",
      advocateMessage: updated,
      requestService: requestUpdate,
    });
  } catch (error) {
    console.error("Reject error:", error);
    res.status(500).json({ message: "Failed to reject user message" });
  }
};

// Delete message
export const deleteAdvocateMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await AdvocateMessage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Advocate message deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete advocate message" });
  }
};
