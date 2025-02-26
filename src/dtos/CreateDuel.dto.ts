import type { WithId, Document, ObjectId } from 'mongodb'


export interface CreateDuelDto extends WithId<Document> {
    _id: ObjectId;
    higherEloUsername: string[];
    lowerEloUsername: string[];
    lowerEloGainPotential: number;
    higherEloGainPotential: number;
    higherEloScore: number;
    lowerEloScore: number;
    date: Date;
    videoUrl: string;
    isDoublesMatch: boolean;
}