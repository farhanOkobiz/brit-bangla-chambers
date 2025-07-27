import RequestForAdvocate from "../models/requestForAdvocateSchema.js";
import RequestService from "../models/requestServiceSchema.js";

export const createAdvocateMessage = async (req, res) => {
  try {
    const { userMessage, userMessageId, advocateId } = req.body;

    if (!userMessage || !userMessageId || !advocateId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMessage = new RequestForAdvocate({
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
    const messages = await RequestForAdvocate.find();
    console.log(messages);

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete message
export const deleteAdvocateMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await RequestForAdvocate.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Advocate message deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete advocate message" });
  }
};

export const getRequestForAdvocate = async (req, res) => {
  try {
    const advocate_id = req.user._id;

    const messages = await RequestService.find({
      forwardedTo: advocate_id,
    }).sort({ createdAt: -1 });

    console.log(messages);

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching advocate messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};
