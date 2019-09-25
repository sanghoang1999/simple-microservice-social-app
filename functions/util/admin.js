const admin = require("firebase-admin");
const config = require("../util/config");
var serviceAccount = require("../../social-app-f685d-firebase-adminsdk-psjk9-d8d8c0cbda.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://social-app-f685d.firebaseio.com",
  storageBucket: config.storageBucket
});

const db = admin.firestore();

module.exports = { admin, db };
