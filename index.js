const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const { ObjectID, ObjectId } = require("bson");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xoju.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const blogsCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("blogs");

  /* 
                                        Post Api 
                                                                                                */

  app.post("/add-blogs", (req, res) => {
    const newBlogs = req.body;
    blogsCollection.insertOne(newBlogs).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  /* 
                                        Get Api 
                                                                                                */

  app.get("/all-blogs", (req, res) => {
    blogsCollection.find().toArray((err, blogs) => {
      res.send(blogs);
    });
  });

  app.get("/all-blogs/:id", (req, res) => {
    blogsCollection
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, blog) => {
        res.send(blog[0]);
      });
  });

  /* 
                                        Delete Api 
                                                                                                */

  app.delete("/delete-blog/:id", (req, res) => {
    blogsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  //end
});

app.get("/", (req, res) => {
  res.send("Welcome to My Blog Server API");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
