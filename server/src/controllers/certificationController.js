// In certificationController.js
import Certification from "../models/certificationSchema.js";
import Advocate from "../models/advocateSchema.js";

export const addCertificationToAdvocate = async (req, res) => {
  try {
    const { advocateId } = req.params;
    const certData = req.body; // certification fields

    // Create new certification
    const certification = await Certification.create({
      ...certData,
      advocate_id: advocateId
    });

    // Push the new certification's _id into advocate's certification_ids
    await Advocate.findByIdAndUpdate(
      advocateId,
      { $push: { certification_ids: certification._id } }
    );

    res.status(201).json({ message: "Certification added", certification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};