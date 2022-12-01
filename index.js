const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.kerxc7m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const volunteerCollection = client
      .db("volunteer-db")
      .collection("volunteer");
    const volunteerListCollection = client
      .db("volunteer-db")
      .collection("volunteersList");
    const volunteerFAQCollection = client.db("volunteer-db").collection("faq");
    const volunteerBlogCollection = client
      .db("volunteer-db")
      .collection("blog");

    //data get from database
    app.get("/volunteers", async (req, res) => {
      const query = {};
      const cursor = volunteerCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //get data by id
    app.get("/volunteers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await volunteerCollection.findOne(query);
      res.sen(result);
    });

    //data get from database (volunteersList)
    app.get("/volunteersList", async (req, res) => {
      const query = {};
      const cursor = volunteerListCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //get data by id (volunteersList)
    app.get("/volunteersList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await volunteerListCollection.findOne(query);
      res.sen(result);
    });

    //POST ->  Add volunteer (volunteer list)
    app.post("/volunteersList", async (req, res) => {
      const newVolunteer = req.body;
      const result = await volunteerListCollection.insertOne(newVolunteer);
      res.send(result);
    });

    // Delete a volunteer
    app.delete("/volunteersList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await volunteerListCollection.deleteOne(query);
      res.send(result);
    });

    //update volunteer
    app.put("/volunteersList/:id", async (req, res) => {
      const id = req.params.id;
      const updateVolunteer = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          first_name: updateVolunteer.first_name,
          email: updateVolunteer.email,
          resistingDate: updateVolunteer.resistingDate,
          volunteerId: updateVolunteer.volunteerId,
        },
      };
      const result = await volunteerListCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //.............................................
    //.............FAQ.............................
    //.............................................

    //data get from database
    app.get("/faq", async (req, res) => {
      const query = {};
      const cursor = volunteerFAQCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //.............................................
    //.............BLOG.............................
    //.............................................

    //data get from database
    app.get("/blog", async (req, res) => {
      const query = {};
      const cursor = volunteerBlogCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //get data by id (volunteersList)
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await volunteerBlogCollection.findOne(query);
      res.sen(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running my volunteer network");
});
app.listen(port, () => {
  console.log("hello my port is", port);
});
