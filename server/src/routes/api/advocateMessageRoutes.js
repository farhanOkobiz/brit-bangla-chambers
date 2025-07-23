import { Router } from "express";
import {
  createAdvocateMessage,
  deleteAdvocateMessage,
  getAdvocateMessage,
  acceptedMessageStatus,
  rejectedMessageStatus,
} from "../../controllers/advocateMessageController.js";

const router = Router();

router.post("/", createAdvocateMessage);
router.get("/", getAdvocateMessage);
router.patch("/accepted/:id", acceptedMessageStatus);
router.patch("/rejected/:id", rejectedMessageStatus);
router.delete("/:id", deleteAdvocateMessage);

export default router;
