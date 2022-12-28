const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2zjbmhw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

async function run(){
    try{
        const allPostCollections = client.db('helloSnap').collection('allPosts');

        app.post('/allPosts', async (req, res) =>{
            const post = req.body;
            const result = await allPostCollections.insertOne(post);
            res.send(result);
        })
        app.get('/allPosts', async (req, res) => {
            const query = {};
            const options = await allPostCollections.find(query).toArray();
            res.send(options);
        })
        app.get('/allPosts/:id', async (req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const post = await allPostCollections.findOne(query);
          res.send(post);
        })
        app.put('/comment/:id', async (req, res) =>{
          const id = req.params.id;
          const mes = req.body;
          const filter = {_id: ObjectId(id)};
          const option = {upsert: true};
          const updatedDoc ={
            $set:{
              comment: mes.message
            }
          }
          const result = await allPostCollections.updateOne (filter, updatedDoc, option);
          res.send(result);
        })
    }
    finally{

    }

}
run().catch(console.dir);





app.get("/", async (req, res) => {
  res.send("Hello server is running");
});
app.listen(port, () => console.log(`hello portal is running on : ${port}`));
