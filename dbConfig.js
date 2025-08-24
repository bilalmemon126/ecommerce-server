import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://bilalmemon:admin%40bilal123%21@ecommerce.y9tokfn.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce";

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});