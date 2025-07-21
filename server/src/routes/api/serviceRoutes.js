import express from "express";


import { createService, deleteService, getAllServices, getServiceById, updateService } from "../../controllers/serviceController.js";
import upload from "../../middleware/multerMiddleware.js";
import { checkAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-service", checkAdmin, upload.single("serviceImage"), createService);
router.put("/update-service/:id",checkAdmin, upload.single("serviceImage"), updateService);
router.delete("/delete-service/:id",checkAdmin, deleteService);
router.get("/get-all-service",  getAllServices);
router.get("/get-service/:id", getServiceById);

export default router;
