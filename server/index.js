const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

const databaseAndCollection = {
  db: process.env.MONGO_DB_NAME,
  collection: process.env.MONGO_COLLECTION,
};

const uri = process.env.MONGO_CONNECTION_STRING;
const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/api/hello", (req, res) => {
  res.send("Hello from Express!");
});

async function submitRating(albumName, artist, description, rating) {
  try {
    await client.connect();

    let application = {
      albumName: albumName,
      artist: artist,
      description: description,
      rating: rating,
    };

    const result = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .insertOne(application);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
