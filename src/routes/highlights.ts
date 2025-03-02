import { Router } from "express";
import { getHighlights, createHighlight, deleteHighlight } from "../handlers/highlights";
import bodyParser, { BodyParser} from "body-parser";

const router = Router();

const jsonParser = bodyParser.json()
// /duels
router.get('/',  getHighlights);


router.post('/', jsonParser, createHighlight)

router.delete("/:highlightId", deleteHighlight)

export default router; 