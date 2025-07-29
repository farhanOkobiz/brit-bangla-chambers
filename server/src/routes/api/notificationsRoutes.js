import express from "express";
import {
  deleteNotification,
  getNotifications,
} from "../../controllers/notificationController.js";

const router = express.Router();

router.get("/:userId", getNotifications);
router.delete("/:deleteId", deleteNotification);

export default router;
