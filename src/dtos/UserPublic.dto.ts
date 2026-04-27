import type { WithId, Document, ObjectId } from 'mongodb'


export interface UserPublicDto extends WithId<Document> {
    id: ObjectId;
    username: string;
    name: string;
    elo: number;
    hasPfp: boolean;
}

export const UserPublicProjection = {
    _id: 1,
    username: 1,
    name: 1,
    elo: 1,
    hasPfp: 1,
}