import HelpAndSupport from "../models/helpAndSupportSchema.js";

// Create a new help and support request
const createHelpRequest = async (req, res) => {
  try {
    const helpRequest = new HelpAndSupport({
      userId: req.user._id,
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });
    await helpRequest.save();
    res.status(201).json({ success: true, data: helpRequest });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all help and support requests
const getAllHelpRequests = async (req, res) => {
  try {
    const requests = await HelpAndSupport.find().populate("userId", "full_name email");
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getMyHelpRequests = async (req, res) => {
  try {
    const { _id } = req.user;
    const user_id = _id;
    const requests = await HelpAndSupport.find({ userId: user_id }).populate("userId", "full_name email");
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



// Get a single help and support request by ID
const getHelpRequestById = async (req, res) => {
  try {
    const request = await HelpAndSupport.findById(req.params.id).populate("userId", "full_name email");
    if (!request) return res.status(404).json({ success: false, error: "Request not found" });
    res.status(200).json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update status of a help and support request
const updateHelpRequestStatus = async (req, res) => {
  try {
    const request = await HelpAndSupport.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!request) return res.status(404).json({ success: false, error: "Request not found" });
    res.status(200).json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a help and support request
const deleteHelpRequest = async (req, res) => {
  try {
    const request = await HelpAndSupport.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ success: false, error: "Request not found" });
    res.status(200).json({ success: true, message: "Request deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export {
    createHelpRequest,
    getAllHelpRequests,
    getHelpRequestById,
    updateHelpRequestStatus,
    deleteHelpRequest,
    getMyHelpRequests
};