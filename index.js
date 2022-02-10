const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// change by another folder
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfvuq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("yoodaServicce");
    const studentsCollection = database.collection("students");
    const foodsCollection = database.collection("foods");
    const servedCollection = database.collection("served");

    app.get("/students", async (req, res) => {
      const cursor = studentsCollection.find({});
      const page = parseInt(req.query.page);
      let students;
      const count = await cursor.count();
      if (page >= 0) {
        students = await cursor
          .skip(page * 10)
          .limit(10)
          .toArray();
      } else {
        students = await cursor.toArray();
      }
      res.send({
        count,
        students,
      });
    });
    app.get("/foods", async (req, res) => {
      const cursor = foodsCollection.find({});
      const page = parseInt(req.query.page);
      let foods;
      const count = await cursor.count();
      if (page >= 0) {
        foods = await cursor
          .skip(page * 10)
          .limit(10)
          .toArray();
      } else {
        foods = await cursor.toArray();
      }
      res.send({
        count,
        foods,
      });
    });
    // fetch served by id
    app.get("/served", async (req, res) => {
      const cursor = servedCollection.find({});
      const page = parseInt(req.query.page);
      let serveds;
      const count = await cursor.count();
      if (page >= 0) {
        serveds = await cursor
          .skip(page * 10)
          .limit(10)
          .toArray();
      } else {
        serveds = await cursor.toArray();
      }
      res.send({
        count,
        serveds,
      });
    });
    //delete food
    app.delete("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await foodsCollection.deleteOne(query);
      res.json(result);
    });
    //delete student
    app.delete("/students/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentsCollection.deleteOne(query);
      res.json(result);
    });
    //add student
    app.post("/students", async (req, res) => {
      const cursor = req.body;
      const result = await studentsCollection.insertOne(cursor);
      res.json(result);
    });
    //add served
    app.post("/served", async (req, res) => {
      const cursor = req.body;
      const result = await servedCollection.insertOne(cursor);
      res.json(result);
    });
    //add food
    app.post("/foods", async (req, res) => {
      const cursor = req.body;
      const result = await foodsCollection.insertOne(cursor);
      res.json(result);
    });
    // fetch by id
    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await foodsCollection.findOne(query);
      res.send(result);
    });
    //find served
    app.get("/served/:id", async (req, res) => {
      const id = req.params.id;
      const query = id;
      const result = await servedCollection.findOne(query);
      res.send(result);
    });
    // fetch by id
    app.get("/students/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentsCollection.findOne(query);
      res.send(result);
    });

    // update students information
    app.put("/students/:id", async (req, res) => {
      const id = req.params.id;
      const updateStudent = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          id: updateStudent.id,
          name: updateStudent.name,
          roll: updateStudent.roll,
          age: updateStudent.age,
          class: updateStudent.class,
          hall: updateStudent.hall,
          status: updateStudent.status,
        },
      };
      const result = await studentsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // update food information
    app.put("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const updateFood = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          id: updateFood.id,
          name: updateFood.name,
          price: updateFood.price,
        },
      };
      const result = await foodsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //active status
    app.put("/students/active/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "active",
        },
      };
      const result = await studentsCollection.updateOne(query, updateDoc);
      res.json(result);
    });
    //inactive status
    app.put("/students/inActive/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "inActive",
        },
      };
      const result = await studentsCollection.updateOne(query, updateDoc);
      res.json(result);
    });

  } finally {
    //a
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Start");
});
app.listen(port, () => {
  console.log("Listening to port", port);
});
