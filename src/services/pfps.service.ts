import { BlockBlobClient, BlobUploadCommonResponse} from '@azure/storage-blob';
import { containerClient } from "./database.service";
import fs from 'fs';
import { BlobStorageError } from '../errors/BlobStorageError';

export async function uploadPfp(file:any, username: string) {

    const blobClient:BlockBlobClient = containerClient.getBlockBlobClient(username);

    // Upload the file to Azure Blob Storage
    const uploadBlobResponse:BlobUploadCommonResponse = await blobClient.uploadFile(file.path, {
    blobHTTPHeaders: { blobContentType: file.mimetype }
    });

    // status should be 201 if uploaded successfully
    if (uploadBlobResponse._response.status !== 201) {
        throw new BlobStorageError();
    } 

    // remove the file from the local server after uploading to Azure Blob Storage
    fs.unlinkSync(file.path);
}