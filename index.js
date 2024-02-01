const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
  // console.log("hitting verify jwt");
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized access" });
  }
  const token = authorization.split(" ")[1];
  console.log("TOKEN INSSIDE VERIFY", token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res
        .status(403)
        .send({ error: true, message: "Unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

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

    //get region
    app.get("/region", async (req, res) => {
      const cursor = regionCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //post area
    app.post("/area", async (req, res) => {
      const list = req.body;
      console.log(list);
      const result = await areaCollection.insertOne(list);
      res.send(result);
    });

    //get area
    app.get("/area", async (req, res) => {
      const cursor = areaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //jwt
    app.post("/jwt", (req, res) => {
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
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
