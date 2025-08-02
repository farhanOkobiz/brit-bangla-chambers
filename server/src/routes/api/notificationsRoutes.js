import express from "express";
import {
  deleteNotification,
  getNotifications,
  readNotification,
} from "../../controllers/notificationController.js";
import { checkClient } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", getNotifications);
router.patch("/read", checkClient, readNotification);
router.delete("/:deleteId", deleteNotification);

export default router;
