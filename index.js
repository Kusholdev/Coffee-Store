const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;


//  middleWar
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('coffee  server is getting hotter');
});



// add connection string to application code



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.hl3uycw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log('MongoDB URI:', uri);


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

        const coffeesCollection = client.db('coffeeDb').collection('coffees'); // create a space  db named 'coffeeDb' and insert in MongoDB

        // get the Db data to show UI or do anything . if you get you can kill them too. haHa
        app.get('/coffees', async (req, res) => {
            // const cursor = coffeesCollection.find();
            // const result = await cursor.toArray();
            // res.send(result);
            const result = await coffeesCollection.find().toArray();
            res.send(result);
        })

        //    for view operation in UI
        app.get('/coffees/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:new ObjectId(id)}
            const result  = await coffeesCollection.findOne(query);
            res.send(result);
        })


        //   post to server
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body; //accept the data 
            console.log(newCoffee); // here show my command prompt



            const result = await coffeesCollection.insertOne(newCoffee); //insert inDb
            res.send(result);  // then send it 
        })


        // update a data
        app.put('/coffees/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true };

            const updatedCoffee=  req.body;
            const updatedDoc ={
                $set: updatedCoffee
            };
            const result = await coffeesCollection.updateOne(filter,updatedDoc,options);
          res.send(result);

        })




        // delete operation
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeesCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`coffee server is running at port : ${port}`);
})