const firebaseConfig = require("../util/config");
const firebase = require("firebase");
const config = require("../util/config");
const { db, admin } = require("../util/admin");
const path = require("path");
const os = require("os");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const BusBoy = require("busboy");
const auth = require("../util/Auth");
firebase.initializeApp(firebaseConfig);

router.post(
  "/signup",
  [
    check("handle", "handle is required")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter password with  6 or more character"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, handle } = req.body;
    try {
      const data = await db.doc(`/users/${handle}`).get();
      if (data.exists) {
        return res
          .status(400)
          .json({ errors: [{ msg: "handle has been used" }] });
      }
      const newAuth = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const newUser = {
        handle,
        email,
        createdAt: new Date().toISOString(),

        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/nobody.png?alt=media`,
        userId: newAuth.user.uid
      };
      await db.doc(`/users/${handle}`).set(newUser);

      const token = await newAuth.user.getIdToken();
      res.status(201).json({ token });
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email has been used" }] });
      }
      if (error.code === "auth/weak-password") {
        return res.status(400).json({
          errors: [{ msg: "Password should be at least 6 characters" }]
        });
      }
      res.status(500).json("Server Error");
    }
  }
);

router.post(
  "/login",
  [check("email", "Please enter a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const data = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const token = await data.user.getIdToken();
      res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      if (error.code === "auth/wrong-password") {
        return res.status(400).json({ errors: [{ msg: "Password is wrong" }] });
      }
      if (error.code === "auth/user-not-found") {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email is not exist" }] });
      }
      res.status(500).json("Server Error");
    }
  }
);

router.post("/image", auth, (req, res) => {
  console.log(req.user.handle);
  const busboy = new BusBoy({ headers: req.headers });
  let filepath;
  let mimetype;
  let imageFileName;
  console.log(os.tmpdir());
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ errors: "Wrong file type submitted" });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.round(
      Math.random() * 100000000000
    )}.${imageExtension}`;
    filepath = path.join(os.tmpdir(), imageFileName);
    mimetype = mimetype;
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: mimetype
          }
        }
      })
      .then(async () => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        try {
          await db.doc(`users/${req.user.handle}`).update({ imageUrl });
          res.json({ msg: "image uploaded successfully" });
        } catch (error) {
          console.log(error);
          res.status(500).json("Server Error");
        }
      })
      .catch(err => {
        console.log(err);
      });
  });

  busboy.end(req.rawBody);
});

router.post(
  "/detail",
  auth,
  [
    check("bio")
      .not()
      .isEmpty(),
    check("website")
      .not()
      .isEmpty(),
    check("location")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { bio, website, location } = req.body;
    if (website.trim().substring(0, 5) !== "https") {
      website = `https://${req.body.website}`;
    }
    try {
      await db
        .doc(`/users/${req.user.handle}`)
        .update({ bio, website, location });
      return res.json({ msg: "Details added successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code });
    }
  }
);

router.get("/me", auth, async (req, res) => {
  try {
    const resData = {};
    const userData = await db.doc(`/users/${req.user.handle}`).get();
    if (userData.exists) {
      const likes = await db
        .collection("likes")
        .where("userHandle", "==", req.user.handle)
        .get();
      resData.credentials = userData.data();
      resData.likes =
        likes.docs.map(like => {
          return like.data();
        }) || [];
      return res.status(201).json(resData);
    } else {
      return res.status(404).json({ msg: " No user Detail " });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error.code });
  }
});

//get any user detail

router.get("/:handle", async (req, res) => {
  console.log("emvuidi");
  try {
    resData = {};
    const userData = await db.doc(`users/${req.params.handle}`).get();
    if (userData.exists) {
      resData.user = userData.data();
      const screamData = await db
        .collection("screams")
        .where("userHandle", "==", req.params.handle)
        .orderBy("createdAt", "desc")
        .get();
      resData.screams =
        screamData.docs.map(data => {
          data.screamId = data.id;
          return data;
        }) || [];
      return res.status(201).json(resData);
    } else {
      return res.status(404).json({ msg: " No user Detail " });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error.code });
  }
});

module.exports = router;
