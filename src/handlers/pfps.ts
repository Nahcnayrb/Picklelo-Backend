import {Request, Response} from "express";
import { containerClient } from "../services/database.service";
import fs from 'fs';
import { BlockBlobClient} from '@azure/storage-blob';

export async function uploadPfp(request:Request<{username: string},{},{}>, response:Response) {
    if (request.file) {
        // case file detected
        const blobClient:BlockBlobClient = containerClient.getBlockBlobClient(request.params.username);

        // Upload the file to Azure Blob Storage
        const uploadBlobResponse = await blobClient.uploadFile(request.file.path, {
        blobHTTPHeaders: { blobContentType: request.file.mimetype } // Set content type
        });

        response.status(200).send(uploadBlobResponse);
  
        // remove the file from the local server after uploading to Azure Blob Storage
        fs.unlinkSync(request.file.path);

    } else {
        response.status(500).send('could not detect file');
    }

}

export async function deletePfp(request:Request, response:Response) {

}