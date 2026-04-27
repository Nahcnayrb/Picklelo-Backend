import {Request, Response} from "express";
import * as pfpsService from "../services/pfps.service";
import { BlobStorageError } from "../errors/BlobStorageError";

export async function uploadPfp(request:Request<{username: string},{},{}>, response:Response) {
    if (request.file) {
        // case file is in request
        try {
            const username:string = request.params.username
            await pfpsService.uploadPfp(request.file, username);

            response.status(200).send("Pfp uploaded to blob storage successfully.");
        } catch (error) {
            if (error instanceof BlobStorageError) {
                response.status(400).send("Error occured while uploading pfp to blob storage")
            } else if (error instanceof Error) {
                response.status(500).send(error.message);
            }
        }

    } else {
        // case no file in req
        response.status(404).send('Could not detect file');
    }

}