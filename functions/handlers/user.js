const firebaseConfig = require("../util/config");
const firebase = require("firebase");
const { db } = require("../util/admin");
firebase.initializeApp(firebaseConfig);
const { check, validationResult } = require("express-validator");
exports.signup =
  ([
    check("email", "Name is required")
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
    const { email, password, confirmPassword, handle } = req.body;
    try {
      const data = await db.doc(`/user/${handle}`).get();
      if (data.exists) {
        return res.status(400).json({ handle: data.data() });
      }
      const newAuth = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const newUser = {
        handle,
        email,
        createdAt: new Date().toISOString(),
        userId: newAuth.user.uid
      };
      await db.doc(`/user/${handle}`).set(newUser);

      const token = await newAuth.user.getIdToken();
      res.status(201).json({ token });
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        return res.status(400).json({ errors: { msg: "Email has been used" } });
      }
      res.status(500).json("Server Error");
    }
  });

exports.login =
  ([
    check("email", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail()
  ],
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
        return res.status(400).json({ errors: { msg: "Password is wrong" } });
      }
      if (error.code === "auth/user-not-found") {
        return res.status(400).json({ errors: { msg: "Email is not exist" } });
      }
      res.status(500).json("Server Error");
    }
  });
