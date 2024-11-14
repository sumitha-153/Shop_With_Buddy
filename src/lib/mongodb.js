import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://sumitha:2003@styliee.v3m3a.mongodb.net/';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

if (typeof window === 'undefined') {
  // In development mode, use a global variable to preserve the MongoDB client
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client for each request
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise; 