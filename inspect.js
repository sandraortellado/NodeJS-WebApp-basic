const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://sortel01:dBBTl83Z20HL93Eu@cluster0.9a9rbxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = "assgnmt10";
const collectionName = "places";

async function debugZipcodes() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const sample = await collection.find({}).limit(5).toArray();
        console.log(JSON.stringify(sample, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

debugZipcodes();