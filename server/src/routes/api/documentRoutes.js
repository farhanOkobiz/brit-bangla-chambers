import express from "express";
import upload from "../../middleware/multerMiddleware.js";
import { updateOrCreateDocuments, getDocuments } from "../../controllers/documentationController.js";

const router = express.Router();

router.get(
  "/:userId",
  getDocuments
);

router.put(
  "/:userId",
  upload.array("files"),
  updateOrCreateDocuments
);

export default router;
