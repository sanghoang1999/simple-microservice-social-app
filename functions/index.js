const functions = require("firebase-functions");
const express = require("express");
const { db } = require("./util/admin");
const auth = require("./util/Auth");
const app = express();

app.use(express.json());

const { getAllScreams, postOneScream } = require("./handlers/screams");
const { signup, login } = require("./handlers/user");

app.get("/screams", getAllScreams);
app.post("/scream", postOneScream);

app.post("/signup", signup);

app.post("/login", auth, login);

app.get("/test", async (req, res) => {
  const test = {
    name: "emvuidi"
  };
  try {
    const data = await db
      .collection("/dd/9daJ8qwOW61JrAFeiSl6/likes")
      .add(test);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

exports.api = functions.region("asia-east2").https.onRequest(app);
