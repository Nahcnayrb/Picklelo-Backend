import type { WithId, Document, ObjectId } from 'mongodb'


export interface UserSensitiveDto extends WithId<Document> {
    id: ObjectId;
    username: string;
    email: string;
    password: string;
    token: string;
    hasPfp: boolean;
}