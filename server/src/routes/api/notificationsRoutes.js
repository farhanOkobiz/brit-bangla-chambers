import express from "express";
import {
  deleteNotification,
  getNotifications,
  readNotification,
} from "../../controllers/notificationController.js";

const router = express.Router();

router.get("/:userId", getNotifications);
router.get("/:notificationId/read", readNotification);
router.delete("/:deleteId", deleteNotification);

export default router;
