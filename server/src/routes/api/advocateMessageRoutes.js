import { Router } from "express";
import {
  createAdvocateMessage,
  deleteAdvocateMessage,
  getAdvocateMessage,
  acceptedMessageStatus,
  rejectedMessageStatus,
  getRequestForAdvocate,
} from "../../controllers/requestForAdvocateController.js";
import { checkAdvocate } from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/", createAdvocateMessage);
router.get("/", getAdvocateMessage);
router.get("/advocate", checkAdvocate, getRequestForAdvocate);
router.patch("/accepted/:id", checkAdvocate, acceptedMessageStatus);
router.patch("/rejected/:id", checkAdvocate, rejectedMessageStatus);
router.delete("/:id", deleteAdvocateMessage);

export default router;
