import { Router } from "express";
import { createStaff, deleteStaff, getAllStaff, getStaffById, getStaffProfile, updateStaff } from "../../controllers/staffController.js";
import { checkAdmin, checkStaff } from "../../middleware/authMiddleware.js";

const router = Router();


router.post("/", checkAdmin, createStaff)
router.get('/', checkAdmin, getAllStaff);  
router.get('/profile', checkStaff, getStaffProfile); 
router.get('/:id', checkAdmin, getStaffById); 
router.put('/:id', checkAdmin, updateStaff);
router.delete('/:id', checkAdmin, deleteStaff);


export default router;