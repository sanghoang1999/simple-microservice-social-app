const functions = require("firebase-functions");
const express = require("express");
const { db } = require("./util/admin");
const auth = require("./util/Auth");
const busboy = require("busboy");
const app = express();
app.use(express.json());
const { getAllScreams, postOneScream } = require("./handlers/screams");
const { signup, login, uploadImage } = require("./handlers/user");

app.get("/screams", getAllScreams);
app.post("/scream", postOneScream);

//user route
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", auth, uploadImage);
exports.api = functions.region("asia-east2").https.onRequest(app);
