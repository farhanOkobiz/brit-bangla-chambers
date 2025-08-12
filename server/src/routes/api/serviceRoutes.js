import express from "express";


import { createService, deleteService, getAllServices, getServiceById, updateService } from "../../controllers/serviceController.js";
import upload from "../../middleware/multerMiddleware.js";
import { checkAdmin, protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-service", protect(["admin", "staff"]), upload.single("serviceImage"), createService);
router.put("/update-service/:id",protect(["admin", "staff"]), upload.single("serviceImage"), updateService);
router.delete("/delete-service/:id",checkAdmin, deleteService);
router.get("/get-all-service",protect(["admin", "staff"]),  getAllServices);
router.get("/get-service/:id", protect(["admin", "staff"]), getServiceById);

export default router;
