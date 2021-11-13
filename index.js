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
        const usersCollection = database.collection("users");

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



// Send Bikes Post on database By ADMIN
        app.post('/bikes', async (req, res) => {
            const bike = req.body;
            const result = await bikesCollection.insertOne(bike);
            res.json(result)
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



// DELETE api
        app.delete("/bikes/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bikesCollection.deleteOne(query);
            res.send(result);
        })
        
        
        
// =================================================================
// Make admin
        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne( filter, updateDoc );
            res.json(result);
        });
// User data update
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
// send users registration data on data base
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result);
        })
// get 1 users data for login users
app.get('/users/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let isAdmin = false;
    if (user?.role === 'admin') {
        isAdmin = true;
    }
    res.json({Admin: isAdmin})
})
// =================================================================

        


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
