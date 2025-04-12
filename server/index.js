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
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@koalafied.szyjdqy.mongodb.net/?retryWrites=true&w=majority&appName=Koalafied`;

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

app.use(express.static(path.join(__dirname, "../client/build")));

function addKoalas(koalaList, numInterviews, numApps, newOffer) {
  if (numApps >= 10 && !koalaList.includes("applicationKoala1.png")) {
    koalaList.push("applicationKoala1.png");
  }
  if (numApps >= 25 && !koalaList.includes("applicationKoala2.png")) {
    koalaList.push("applicationKoala2.png");
  }
  if (numApps >= 50 && !koalaList.includes("applicationKoala3.png")) {
    koalaList.push("applicationKoala3.png");
  }
  if (numApps >= 100 && !koalaList.includes("applicationKoala4.png")) {
    koalaList.push("applicationKoala4.png");
  }
  if (numInterviews >= 1 && !koalaList.includes("interviewKoala1.png")) {
    koalaList.push("interviewKoala1.png");
  }
  if (numInterviews >= 5 && !koalaList.includes("interviewKoala2.png")) {
    koalaList.push("interviewKoala2.png");
  }
  if (numInterviews >= 10 && !koalaList.includes("interviewKoala3.png")) {
    koalaList.push("interviewKoala3.png");
  }
  if (newOffer) {
    koalaList.push("offerKoala.png");
  }

  return koalaList;
}

app.get("/api/leaderboard", async (req, res) => {
  try {
    await client.connect();
    const collection = client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection);

    const users = await collection
      .find({}, { projection: { _id: 0, username: 1, points: 1, numApps: 1 } })
      .sort({ points: -1 })
      .limit(10)
      .toArray();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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

app.post("/login", async (request, response) => {
  const post_data = request.body;

  const result = await login(post_data.username, post_data.password);

  if (!result.success) {
    return response.status(400).json({ message: result.message });
  }

  response.json({
    message: "Login successful",
    token: result.token,
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

  const token = request.headers.authorization.split(" ")[1];
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

  const token = request.headers.authorization.split(" ")[1];
  verifyJWT(token);

  const decodedToken = jwt.verify(token, JWT_SECRET);
  const id = decodedToken.username;

  updateNotes(id, post_data.notes);

  console.log("hi");

  response.send("Success");
});

/// db operations

async function login(username, password) {
  try {
    await client.connect();

    const collection = client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection);

    const user = await collection.findOne({ username: username });

    if (!user) {
      console.error("User not found");
      return { success: false, message: "User not found" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.error("Invalid password");
      return { success: false, message: "Invalid password" };
    }

    const payload = { username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    console.log("Login successful");
    return { success: true, token: token };
  } catch (e) {
    console.error("Error during login:", e);
    return { success: false, message: "Error during login" };
  }
}

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
      points: 0,
      notes: "",
      applications: [],
      koalas: ["basicKoala.png"],
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

    let linkString = link.toString();
    if (!linkString.includes("https://") && !linkString.includes("http://")) {
      linkString = "https://" + linkString;
    }

    const application = {
      company,
      position,
      linkString,
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

    // Always increment application
    collection.updateOne({ username: user }, { $inc: { numApps: 1 } });
    collection.updateOne({ username: user }, { $inc: { points: 1 } });

    // Also increment interview or offer depending on status
    if (status == "Interviewed") {
      collection.updateOne({ username: user }, { $inc: { numInterviews: 1 } });
      collection.updateOne({ username: user }, { $inc: { points: 5 } });
    } else if (status == "Offered") {
      collection.updateOne({ username: user }, { $inc: { numOffers: 1 } });
      collection.updateOne({ username: user }, { $inc: { points: 10 } });
    }

    // Update the user's koalas
    const userObj = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .findOne({ username: user });

    let newKoalaList = await addKoalas(
      userObj.koalas,
      userObj.numInterviews,
      userObj.numApps,
      status == "Offered"
    );

    collection.updateOne(
      { username: user },
      { $set: { koalas: newKoalaList } }
    );
  } catch (e) {
    console.error("❌ Error in addApplication:", e);
  }
}

async function updateStatus(user, company, position, status) {
  try {
    await client.connect();

    // Idea: get applicaiton list, add a new one, update the list

    const collection = client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection);

    const cursor = collection.findOne({ username: user });

    const obj = await cursor;

    let applications = obj.applications;

    // find that job in the application list, update the notes
    let foundPosition = false;
    let changedStatus = false;
    let oldStatus = "";

    for (let i = 0; i < applications.length && !foundPosition; i++) {
      let app = applications[i];
      if (app.company == company && app.position == position) {
        if (app.status != status) changedStatus = true;
        oldStatus = app.status;
        app.status = status;
        foundPosition = true;
      }
    }

    if (changedStatus) {
      if (status == "Interviewed" && oldStatus != "Offered") {
        collection.updateOne(
          { username: user },
          { $inc: { numInterviews: 1 } }
        );
        collection.updateOne({ username: user }, { $inc: { points: 5 } });
      } else if (status == "Offered") {
        collection.updateOne({ username: user }, { $inc: { numOffers: 1 } });
        collection.updateOne({ username: user }, { $inc: { points: 10 } });
      }

      // update the applicaiton list
      const result = await client
        .db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .updateOne(
          { username: user },
          { $set: { applications: applications } }
        ); // <-- fix here

      // Update the user's koalas
      const userObj = await client
        .db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .findOne({ username: user });

      let newKoalaList = await addKoalas(
        userObj.koalas,
        userObj.numInterviews,
        userObj.numApps,
        status == "Offered"
      );

      collection.updateOne(
        { username: user },
        { $set: { koalas: newKoalaList } }
      );
    }
  } catch (e) {
    console.error(e);
  }
}

async function updateNotes(user, notes) {
  try {
    await client.connect();

    const result = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .updateOne(
        { username: user },
        { $set: { notes: notes } } // <-- fix here
      );
  } catch (e) {
    console.error(e);
  }
}
