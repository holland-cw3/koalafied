"use strict";
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = "your-secret-key";

const app = express();
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config({ path: path.resolve(__dirname, "credentials/.env") });

const port = 5001;

const databaseAndCollection = {
  db: process.env.MONGO_DB_NAME,
  collection: process.env.MONGO_COLLECTION,
};

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@koalafied.szyjdqy.mongodb.net/?retryWrites=true&w=majority&appName=Koalafied`;

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

app.use(express.static(path.join(__dirname, "../client/build")));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// For Secure Routes:
function verifyJWT(token) {
  if (!token) {
    res.status(200).json({
      success: false,
      message: "Error! User Not Authenticated.",
    });
  }
  return;
}

//  Endpoints

app.post("/createAccount", (request, response) => {
  const post_data = request.body;

  createAccount(post_data.username, post_data.password);

  const payload = {
    username: post_data.username,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  response.json({
    message: "Login successful",
    token: token,
  });
});

app.get("/viewApplications", (request, response) => {
  const token = request.headers.authorization.split(" ")[1];
  verifyJWT(token);

  const decodedToken = jwt.verify(token, JWT_SECRET);
  const id = decodedToken.username;

  viewApplication(id, response);
});

app.post("/addApplication", (request, response) => {
  const post_data = request.body;

  const token = request.headers.authorization.split(" ")[1];
  verifyJWT(token);

  const decodedToken = jwt.verify(token, JWT_SECRET);
  const id = decodedToken.username;

  addApplication(
    post_data.company,
    post_data.position,
    post_data.link,
    post_data.date,
    post_data.status,
    id
  );

  response.send("Success");
});

app.post("/updateStatus", (request, response) => {
  const post_data = request.body;

  const token = req.headers.authorization.split(" ")[1];
  verifyJWT(token);

  updateStatus(
    post_data.user,
    post_data.company,
    post_data.position,
    post_data.status
  );

  response.send("Success");
});

app.post("/updateNotes", (request, response) => {
  const post_data = request.body;

  const token = req.headers.authorization.split(" ")[1];
  verifyJWT(token);

  updateNotes(post_data.user, post_data.notes);

  response.send("Success");
});

/// db operations

async function createAccount(username, password) {
  try {
    await client.connect();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let user = {
      username: username,
      password: hash,
      numApps: 0,
      numInterviews: 0,
      numOffers: 0,
      notes: "",
      applications: [],
    };

    // Make sure username/email isnt already used

    // Add user to the database
    const res = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .insertOne(user);
  } catch (e) {
    console.error(e);
  }
}

async function viewApplication(user, response) {
  try {
    await client.connect();

    const cursor = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .findOne({ username: user });

    // Sends JSON with all the user's data
    const result = await cursor;

    response.send(result);
  } catch (e) {
    console.error(e);
  }
}

async function addApplication(company, position, link, date, status, user) {
  try {
    await client.connect();

    const application = {
      company,
      position,
      link,
      date,
      status,
    };

    const collection = client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection);

    // Get the user document
    const userDoc = await collection.findOne({ username: user });

    if (!userDoc) {
      console.error("User not found");
      return;
    }

    // Push the new application into the existing array
    const updatedResult = await collection.updateOne(
      { username: user },
      { $push: { applications: application } }
    );
    if (status == "Applied") {
      db.products.updateOne({ username: user }, { $inc: { numApps: 1 } });
    } else if (status == "Interviewed") {
      db.products.updateOne({ username: user }, { $inc: { numInterviews: 1 } });
    } else if (status == "Offer") {
      db.products.updateOne({ username: user }, { $inc: { numOffers: 1 } });
    }
  } catch (e) {
    console.error("❌ Error in addApplication:", e);
  }
}

async function updateStatus(user, company, position, status) {
  try {
    await client.connect();

    // DO PASSWORD/SESSION CHECK

    // Idea: get applicaiton list, add a new one, update the list
    const cursor = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .findOne({ username: user });

    const obj = await cursor.toArray();

    let applications = obj.applicaitons;

    // find that job in the application list, update the notes
    for (app in applications) {
      if (app.company.equals(company) && app.position.equals(position)) {
        app.status = status;
        break;
      }
    }

    // update the applicaiton list
    const result = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .updateOne({ username: user }, { applications: applications });
  } catch (e) {
    console.error(e);
  }
}

async function updateNotes(user, notes) {
  try {
    await client.connect();

    // DO PASSWORD/SESSION CHECK

    // find that user and update the notes
    const result = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .updateOne({ username: user }, { notes: notes });
  } catch (e) {
    console.error(e);
  }
}
