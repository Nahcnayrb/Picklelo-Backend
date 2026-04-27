
import { HighlightDto } from "../dtos/Highlight.dto";
import {Request, Response} from "express"
import * as highlightService from "../services/highlight.service";
import { CreateError } from "../errors/CreateError";
import { NotFoundError } from "../errors/NotFoundError";
export async function createHighlight(request:Request<{},{}, HighlightDto>, response:Response) {
    try {
        const highlightData:HighlightDto = request.body as HighlightDto;

        await highlightService.createHighlight(highlightData);
        response.status(201).send("Created a new highlight.");
    } catch (error) {
        if (error instanceof CreateError) {
            response.status(400).send("Failed to create a new highlight.");
        } else if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
}

export async function getHighlights(request:Request, response:Response) {
    try {
        const highlights = await highlightService.getAllHighlights();
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
        await highlightService.deleteHighlight(highlightId);

        response.status(201).send("Deleted highlight.")

    } catch (error) {
        if (error instanceof NotFoundError) {
            response.status(404).send("Failed to delete highlight as it cannot be found.")
        }
        else if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }

}