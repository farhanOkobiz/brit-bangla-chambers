import { Router } from "express";
import { createContact } from "../../controllers/contactUsController.js";

const router = Router();
router.post("/create-contact", createContact);

export default router;
