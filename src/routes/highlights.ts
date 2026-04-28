import { Router } from "express";
import { getHighlights, createHighlight, deleteHighlight } from "../controllers/highlights";
import bodyParser, { BodyParser} from "body-parser";

const router = Router();

const jsonParser = bodyParser.json()
// GET /highlights
router.get('/',  getHighlights);

// POST /highlights
router.post('/', jsonParser, createHighlight)

// DELETE /highlights/<highlightId>
router.delete("/:highlightId", deleteHighlight)

export default router; 