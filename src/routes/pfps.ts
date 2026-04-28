import { Router } from "express";
import { uploadPfp } from "../controllers/pfps";
import multer from "multer";

const router = Router();

const upload = multer({ dest: 'uploads/' });

// PUT /pfps/<username>
router.put('/:username', upload.single('file'), uploadPfp);


export default router;