const { db } = require("../util/admin");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../util/Auth");
router.post(
  "/",
  auth,
  [
    check("body", "body is required")
      .not()
      .isEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const  body  = req.body.body;
    const userHandle = req.user.handle;
    const newScream = {
      body,
      userHandle,
      userImage: req.user.imageUrl,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString()
    };
    db.collection("screams")
      .add(newScream)
      .then(data => {
        const resScream = newScream;
        resScream.id = data.id;
        res.json(resScream);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Server Error" });
      });
  }
);

//get all screams
router.get("/", async (req, res) => {
  try {
    screamsData = await db
      .collection("screams")
      .orderBy("createdAt", "desc")
      .get();
    resData = screamsData.docs.map(data => {
      cc = data.data();
      cc.id = data.id;
      return cc;
    });
    return res.status(201).json(resData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error.code });
  }
});

//get screams by scream_id
router.get("/:screamId", async (req, res) => {
  resData = {};
  try {
    screamsData = await db.doc(`/screams/${req.params.screamId}`).get();
    if (screamsData.exists) {
      commentData = await db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", req.params.screamId)
        .get();
      resData = screamsData.data();
      resData.id = screamsData.id;
      resData.comments =
        commentData.docs.map(data => {
          return data.data();
        }) || [];
      return res.json(resData);
    } else {
      return res.status(404).json({ msg: " Scream not found " });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error.code });
  }
});

router.post(
  "/:screamId/comment",
  auth,
  ([
    check("body")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newCm = {
      body: req.body.body,
      createdAt: new Date().toISOString(),
      screamId: req.params.screamId,
      userHandle: req.user.handle,
      userImage: req.user.imageUrl
    };
    const scream = await db.doc(`screams/${req.params.screamId}`).get();
    if (scream.exists) {
      await db.collection("comments").add(newCm);
      await db
        .doc(`screams/${req.params.screamId}`)
        .update({ commentCount: scream.data().commentCount + 1 });
      return res.json(newCm);
    } else {
      return res.status(404).json({ msg: " Scream not found " });
    }
  })
);

router.get("/:screamId/like", auth, async (req, res) => {
  try {
    const scream = await db.doc(`screams/${req.params.screamId}`).get();
    if (scream) {
      const like = await db
        .collection("likes")
        .where("screamId", "==", req.params.screamId)
        .where("userHandle", "==", req.user.handle)
        .limit(1)
        .get();

      if (like.empty) {
        const newLikeSchema = {
          screamId: req.params.screamId,
          userHandle: req.user.handle
        };
        await db.collection("likes").add(newLikeSchema);
        await db
          .doc(`screams/${req.params.screamId}`)
          .update({ likeCount: scream.data().likeCount + 1 });
        return res.json(newLikeSchema);
      } else {
        return res.status(400).json({ msg: "Scream already liked" });
      }
    } else {
      return res.status(404).json({ msg: "scream not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error.code });
  }
});

router.get("/:screamId/unlike", auth, async (req, res) => {
  try {
    const scream = await db.doc(`screams/${req.params.screamId}`).get();
    if (scream.exists) {
      const like = await db
        .collection("likes")
        .where("screamId", "==", req.params.screamId)
        .where("userHandle", "==", req.user.handle)
        .limit(1)
        .get();

      if (!like.empty) {
        await db.doc(`likes/${like.docs[0].id}`).delete();
        await db
          .doc(`screams/${req.params.screamId}`)
          .update({ likeCount: scream.data().likeCount - 1 });
        return res.json({ msg: "unlike successful" });
      } else {
        return res.status(400).json({ msg: "Server Error" });
      }
    } else {
      return res.status(404).json({ msg: "scream not found" });
    }
  } catch (error) {
    return res.status(500).json({ errors: error.code });
  }
});

router.delete("/:screamId", auth, async (req, res) => {
  try {
    const scream = await db.doc(`screams/${req.params.screamId}`).get();
    if (scream.exists) {
      if (scream.data().userHandle != req.user.handle) {
        return res.status(403).json({ msg: "Unauthorized" });
      }
      await db.doc(`screams/${req.params.screamId}`).delete();
      res.json({ msg: "Scream deleted successfully" });
    } else {
      return res.status(404).json({ msg: "Scream not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error.code });
  }
});

module.exports = router;
