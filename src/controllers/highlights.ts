
import { HighlightDto } from "../dtos/Highlight.dto";
import {Request, Response} from "express"
import { collections } from "../services/database.service";
import { ObjectId } from "mongodb";

export async function createHighlight(request:Request<{},{}, HighlightDto>, response:Response) {
    const highlightData:HighlightDto = request.body as HighlightDto;

    highlightData.date = new Date();
    
    const result = await collections.highlights!.insertOne(highlightData);

    return result
    ? response.status(201).send("Created a new highlight.")
    : response.status(500).send("Failed to create a new highlight.");
}

export async function getHighlights(request:Request, response:Response) {
    try {
        const highlights:HighlightDto[] = (await collections.highlights!.find({}).toArray()) as HighlightDto[];
            response.status(200).send(highlights);
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
}

export async function deleteHighlight(request:Request<{highlightId:string},{},{}>, response:Response) {

    try {
        const highlightId:string =  request.params.highlightId;
        const query = {_id: new ObjectId(highlightId)}
        const result = await collections.highlights!.deleteOne(query)

        return result
        ? response.status(201).send("Deleted highlight.")
        : response.status(500).send("Failed to delete highlight.");
    } catch (error) {
        if (error instanceof Error) {
            return response.status(500).send(error.message);
        }
    }

}