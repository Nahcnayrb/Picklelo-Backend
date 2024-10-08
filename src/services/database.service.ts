// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables
export const collections: { players?: mongoDB.Collection, duels?: mongoDB.Collection} = {}

// Initialize Connection


export async function connectToDatabase () {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING as string);
          
  await client.connect();
      
  const db: mongoDB.Db = client.db(process.env.DB_NAME);
 
  const playersCollection: mongoDB.Collection = db.collection(process.env.PLAYERS_COLLECTION_NAME as string);
  const duelsCollection: mongoDB.Collection = db.collection(process.env.DUELS_COLLECTION_NAME as string);

  collections.players = playersCollection;
  collections.duels = duelsCollection;
     
  console.log(`Successfully connected to database: ${db.databaseName} and collections: ${playersCollection.collectionName} and ${duelsCollection.collectionName}`);
}