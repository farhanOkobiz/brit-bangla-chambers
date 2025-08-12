import { Router } from 'express';
import { 
    showProfile,
    showProfileByClientId,  
    showProfileByUserId,
    showAllClients,
    createClientProfile,
    updateClientProfile,
    deleteClientProfile
} 

from '../../controllers/clientController.js';
import { checkAdmin, checkClient, protect } from '../../middleware/authMiddleware.js';
import upload from '../../middleware/multerMiddleware.js';

const router = Router();

// OTP routes
router.get('/profile', checkClient, showProfile);
router.get('/profile/:id', checkAdmin, showProfileByUserId);
router.get('/profile/client/:id', checkAdmin, showProfileByClientId);
router.get('/all', protect(['admin', 'staff']) , showAllClients);

router.post('/create', checkAdmin, createClientProfile);
router.put('/update/:id', protect(['admin', 'client', 'staff']) , upload.single("profilePhoto")  , updateClientProfile);
router.delete('/profile/:id', checkAdmin, deleteClientProfile)
export default router;
