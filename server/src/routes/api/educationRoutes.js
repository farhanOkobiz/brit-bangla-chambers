// routes/educationRoutes.js
import express from "express";
import  upload  from "../../middleware/multerMiddleware.js";
import { updateOrCreateEducations , getEducationsByAdvocate} from "../../controllers/educationController.js";

const router = express.Router();

router.get("/:advocateId", getEducationsByAdvocate);
router.post(
  "/:advocateId",
  upload.array("certificates"),
  updateOrCreateEducations
);


export default router;
