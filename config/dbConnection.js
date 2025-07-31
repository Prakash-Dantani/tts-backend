
const { MongoClient, ServerApiVersion } = require('mongodb');
MONGO_URI=mongodb://localhost:27017/tts 

// mongorestore--uri "mongodb+srv://dantaniprakash08:WGiYpaQtiCpGPdp9@text-to-speech.bh9ocng.mongodb.net"./ dump / tts


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
