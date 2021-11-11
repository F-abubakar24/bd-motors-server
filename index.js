const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');

const app = express()
const port = process.env.PORT || 4000;

// Middle Ware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.of2la.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// ===================================================================


async function run() {
    try {
        await client.connect();
        const database = client.db("Bd_Motors");
        const bikesCollection = database.collection("bikes");
        // const usersCollection = database.collection("users");


// get bikes all data
        app.get('/bikes', async(req, res) => {
            const cursor = bikesCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })


    } finally {
        // await client.close()
    }
}
run().catch(console.dir);


// ===================================================================
app.get('/', (req, res) => {
    res.send('BD Motors Server is Running ---- !')
})
app.listen(port, () => {
    console.log("Server is running from ---------------------------> ", port)
})
