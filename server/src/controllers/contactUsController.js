import Contact from "../models/contactUsSchema.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    return res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact creation error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    await Contact.findByIdAndDelete(id);
    return res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
