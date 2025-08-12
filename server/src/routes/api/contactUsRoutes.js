import { Router } from "express";
import {
  createContact,
  getAllContacts,
  deleteContact,
} from "../../controllers/contactUsController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = Router();
router.post("/create-contact", protect(["admin", "staff"]), createContact);
router.get("/all-contact-message",protect(["admin", "staff"]), getAllContacts);
router.delete("/delete-contact/:id",protect(["admin", "staff"]), deleteContact);

export default router;
