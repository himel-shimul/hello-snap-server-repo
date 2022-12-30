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
        const allCommentCollections = client.db('helloSnap').collection('allComments');
        const allUsersCollections = client.db('helloSnap').collection('allUsers');

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

        app.post('/allComments', async (req, res) =>{
          const comment = req.body;
          const result = await allCommentCollections.insertOne(comment);
          res.send(result);
        })
        app.post('/addUserInfo', async (req, res) =>{
          const user = req.body;
          const result = await allUsersCollections.insertOne(user);
          res.send(result);
        })
        app.get('/allUsers', async (req, res) => {
          const query = {};
          const options = await allUsersCollections.find(query).toArray();
          res.send(options);
      })
      app.get('/allUsers/:email', async (req, res) =>{
        const userEmail = req.params.email;
        const query = {email: userEmail};
        console.log( query, userEmail);
        const currentUser = await allUsersCollections.findOne(query);
        res.send(currentUser);
      })
      app.patch('/allUsers/:email', async (req, res) =>{
        const userEmail = req.params.email;
        const data = req.body.userProfile;
        const filter = {email: userEmail};
        const updateRev = {
          $set: {
              ...data
          }
      }
      const result = await allUsersCollections.updateOne(filter, updateRev);
      res.send(result);
      })

        app.get('/allComments', async (req, res) =>{
          let query = {};
          if(req.query.postId){
            query ={
              postId: req.query.postId
            }
          }
          const cursor = allCommentCollections.find(query);
          const comments = await cursor.toArray();
          res.send(comments);
        })

        // app.put('/comment/:id', async (req, res) =>{
        //   const id = req.params.id;
        //   const mes = req.body;
        //   const filter = {_id: ObjectId(id)};
        //   const option = {upsert: true};
        //   const updatedDoc ={
        //     $set:{
        //       comment: mes.message
        //     }
        //   }
        //   const result = await allPostCollections.updateOne (filter, updatedDoc, option);
        //   res.send(result);
        // })
    }
    finally{

    }

}
run().catch(console.dir);





app.get("/", async (req, res) => {
  res.send("Hello server is running");
});
app.listen(port, () => console.log(`hello portal is running on : ${port}`));
