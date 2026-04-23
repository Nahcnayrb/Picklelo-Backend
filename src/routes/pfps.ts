import { Router } from "express";
import { uploadPfp, deletePfp  } from "../handlers/pfps";
import multer from "multer";

const router = Router();

const upload = multer({ dest: 'uploads/' });

router.put('/:username', upload.single('file'), uploadPfp);


export default router;