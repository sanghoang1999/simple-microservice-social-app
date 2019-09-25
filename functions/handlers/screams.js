const { db } = require("../util/admin");
const { check, validationResult } = require("express-validator");
exports.postOneScream = (req, res) => {
  const { body, userHandle } = req.body;
  const newScream = {
    body,
    userHandle,
    createdAt: new Date().toISOString()
  };
  db.collection("screams")
    .add(newScream)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    });
};
exports.getAllScreams = (req, res) => {
  db.collection("screams")
    .get()
    .then(data => {
      let screems = [];
      data.forEach(doc => {
        screems.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.status(200).json(screems);
    })
    .catch(err => {
      console.log(err);
    });
};
// (exports.commentOnScream = check("body")
//   .not()
//   .isEmpty()),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const newComment = {
//       body: req.body.body,
//       createdAt: new Date().toISOString(),
//       screamID: req.params.screamId,
//       userHandle: req.user.handle
//     };
//   };
