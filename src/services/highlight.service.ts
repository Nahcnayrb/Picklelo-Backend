import { HighlightDto } from "../dtos/Highlight.dto";
import { CreateError } from "../errors/CreateError";
import { NotFoundError } from "../errors/NotFoundError";
import * as highlightRepository from "../repositiories/highlight.repository";
export async function createHighlight(highlightData: HighlightDto) {
    highlightData.date = new Date();
    const result = await highlightRepository.createHighlight(highlightData);
    
    if (result.insertedId == null) {
        throw new CreateError();
    } else {
        return result.insertedId;
    }
}

export async function getAllHighlights() {
    const highlights: HighlightDto[] = (await highlightRepository.getAllHighlights()) as HighlightDto[];

    return highlights;
}

export async function deleteHighlight(highlightId: string) {
    const result = await highlightRepository.deleteHighlight(highlightId);

    if (result.deletedCount == 0) {
        // can't delete highlight
        throw new NotFoundError();
    } else {
        // success
        return result.acknowledged;
    }

}