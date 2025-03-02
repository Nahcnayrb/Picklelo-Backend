import type { WithId, Document, ObjectId } from 'mongodb'


export interface CreateHighlightDto extends WithId<Document> {
    _id: ObjectId;
    videoUrl: string,
    date: Date,
    playerUsernames: string[],
    clipperUsername: string,
    title: string,
    startTime: number,
    endTime: number
}