import { Router } from "express";
import {
  createAdvocateMessage,
  deleteAdvocateMessage,
  getAdvocateMessage,
  getRequestForAdvocate,
} from "../../controllers/requestForAdvocateController.js";
import { checkAdvocate } from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/", createAdvocateMessage);
router.get("/", getAdvocateMessage);
router.get("/advocate", checkAdvocate, getRequestForAdvocate);
router.delete("/:id", deleteAdvocateMessage);

export default router;
