import type { WithId, Document, ObjectId } from 'mongodb'


export interface UserDto extends WithId<Document> {
    id: ObjectId;
    username: string;
    name: string;
    email: string;
    password: string;
    elo: number;
    token: string;
    hasPfp: boolean;
}