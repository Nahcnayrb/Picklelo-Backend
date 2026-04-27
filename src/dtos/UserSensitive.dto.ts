import type { WithId, Document, ObjectId } from 'mongodb'


export interface UserSensitiveDto extends WithId<Document> {
    id: ObjectId;
    username: string;
    email: string;
    password: string;
    token: string;
}

export const UserSensitiveProjection = {
    _id: 1,
    username: 1,
    email: 1,
    password: 1,
    token: 1,
}