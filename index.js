const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();


// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.czzzy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)


async function run() {
    try {
        await client.connect();
        // console.log('Connected')
        const database = client.db("travelers");
        const packageCollection = database.collection("packages");
        const purchaseCollection = database.collection("bookingPackages");

        //   get all packages
        app.get("/packages", async (req, res) => {
            const packages = await packageCollection.find({}).toArray();
            res.json(packages);
        });

        // add package
        app.post("/packages", async (req, res) => {
            const package = req.body;
            const result = await packageCollection.insertOne(package);
            res.json(result);
        });

        // get single package
        app.get("/package/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packageCollection.findOne(query);
            res.json(result);
        });

        // // // Purchase package
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await purchaseCollection.insertOne(order);
            res.json(result);
        });

        // get orders  by email
        app.get("/orders/:email", async (req, res) => {
            const result = await purchaseCollection.find({ email: req.params.email }).toArray();
            res.json(result);
        });
        //delete order from the database
        app.delete("/deleteOrders/:id", async (req, res) => {
            const result = await purchaseCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.json(result);
        });

        //   get all order
        app.get("/allOrders", async (req, res) => {
            const result = await purchaseCollection.find({}).toArray();
            res.json(result);
        });

        //  update products
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            console.log('id ',id)
            const filter = { _id: ObjectId(id) };
            const result = await purchaseCollection.updateOne(filter, {
                $set: {
                    status: "Confirmed",
                },
            });
            res.json(result);
        });
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hello Travellers')
})
app.listen(port, () => {
    console.log('listening on port', port)
})