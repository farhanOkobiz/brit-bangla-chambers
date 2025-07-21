import { Router } from "express";
import {
  createContact,
  getAllContacts,
  deleteContact,
} from "../../controllers/contactUsController.js";

const router = Router();
router.post("/create-contact", createContact);
router.get("/all-contact-message", getAllContacts);
router.delete("/delete-contact/:id", deleteContact);

export default router;
