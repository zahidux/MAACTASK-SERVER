const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.er7kd0t.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const regionCollection = client.db("fieldx").collection("region");
    const areaCollection = client.db("fieldx").collection("area");

    //post region
    app.post("/region", async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await regionCollection.insertOne(item);
      res.send(result);
    });

    //post area
    app.post("/area", async (req, res) => {
      const list = req.body;
      console.log(list);
      const result = await areaCollection.insertOne(list);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("FieldX is running...");
});

app.listen(port, () => {
  console.log(`FieldX server running is: ${port}`);
});
