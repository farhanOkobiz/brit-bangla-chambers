import express from "express";
import upload from "../../middleware/multerMiddleware.js";
import { updateOrCreateCertifications, getCertificationsByAdvocate } from "../../controllers/certificationController.js";

const router = express.Router();

// GET certifications for an advocate
router.get("/:advocateId", getCertificationsByAdvocate);

// PATCH (update/create) certifications for an advocate
router.patch(
  "/:advocateId",
  upload.array("certificates"),
  updateOrCreateCertifications
);

export default router;
