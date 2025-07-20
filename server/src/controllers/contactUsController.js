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
