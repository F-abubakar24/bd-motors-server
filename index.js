const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


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
        const ordersCollection = database.collection("orders");
        const reviewCollection = database.collection("review");
// ===================================================================


// get bikes all data
        app.get('/bikes', async(req, res) => {
            const cursor = bikesCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })



// get review data
        app.get('/reviews', async(req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })



// get single bike data
        app.get('/bikes/:bikeId', async (req, res) => {
            const id = req.params.bikeId;
            const query = { _id: ObjectId(id) }
            const hotel = await bikesCollection.findOne(query)
            res.json(hotel);
        })



// Send orders info on database
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result)
        })



// Send review info on database
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result)
        })



// Get orders info from database 
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray();
            res.json(result)
        })



// DELETE api
        app.delete("/orders/:orderId", async (req, res) => {
            const id = req.params.orderId;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
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
