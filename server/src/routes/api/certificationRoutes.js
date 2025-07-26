import express from "express";
import upload from "../../middleware/multerMiddleware.js";
import { updateOrCreateCertifications } from "../../controllers/certificationController.js";

const router = express.Router();

router.post(
  "/:advocateId",
  upload.array("certificates"), // 'certificates' should match the frontend field name
  updateOrCreateCertifications
);

export default router;
