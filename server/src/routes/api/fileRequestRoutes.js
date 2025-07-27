import {Router} from 'express';
import { createFileRequest, deleteFileRequest, updateFileRequest } from '../../controllers/fileRequestController.js';
import upload from '../../middleware/multerMiddleware.js';
const router = Router();

router.post('/', upload.array('files'), createFileRequest);
router.put('/:id', upload.array('files'), updateFileRequest);
router.delete("/:id", deleteFileRequest);

export default router;