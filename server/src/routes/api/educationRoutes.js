// routes/educationRoutes.js
import express from "express";
import  upload  from "../../middleware/multerMiddleware.js";
import { updateOrCreateEducations } from "../../controllers/educationController.js";

const router = express.Router();

router.post(
  "/:advocateId",
  upload.array("certificates"),
  updateOrCreateEducations
);

export default router;
