const express = require("express");
const bodyParser = require("body-parser");

const environment = require("./environment"); 
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = environment.mongoDB.MONGODB_URI;
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/api/users", (req, res, next) => {
  const users = [
    {
      id: "1",
      name: "Luke",
      content: "I will make a DND Master with ChatGPT"
    },
    {
      id: "2",
      name: "Betty",
      content: "This is my wife! She play computer games every day!"
    }
  ];
  res.status(200).json({
    message: "Posts fetched successfully!",
    users: users
  });
});

module.exports = app;