const { admin, db } = require("./admin");
module.exports = async (req, res, next) => {
  console.log(JSON.stringify(req.headers));
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const token = req.headers.authorization.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      const user = await db
        .collection("user")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
      console.log(user);
      req.user.handle = user.docs[0].handle;
      return next();
    } catch (error) {
      console.log(error);
      return res.status("500").json("Server Error");
    }
  } else {
    return res.status(403).json({ errors: "Unauthorized" });
  }
};
