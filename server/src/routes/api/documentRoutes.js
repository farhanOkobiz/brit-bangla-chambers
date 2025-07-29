import express from "express";
import upload from "../../middleware/multerMiddleware.js";
import { updateOrCreateDocuments } from "../../controllers/documentationController.js";


const router = express.Router();

router.post(
  "/:userId",
  upload.array("files"), // Match field name from Postman/form
  updateOrCreateDocuments
);

export default router;
