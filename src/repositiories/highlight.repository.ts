import { HighlightDto } from "../dtos/Highlight.dto";
import { collections } from "../services/database.service";
import { ObjectId } from "mongodb";

export async function createHighlight(highlightData: HighlightDto) {
    return collections.highlights!.insertOne(highlightData);
}

export async function getAllHighlights() {
    return collections.highlights!.find({}).toArray();
}

export async function deleteHighlight(highlightId: string) {
    const query = {_id: new ObjectId(highlightId)};

    return collections.highlights!.deleteOne(query);
}