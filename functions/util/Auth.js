const { admin, db } = require("./admin");
module.exports = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const token = req.headers.authorization.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      const user = await db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
      req.user.handle = user.docs[0].data().handle;
      req.user.imageUrl = user.docs[0].data().imageUrl;
      console.log(req.user.handle);
      return next();
    } catch (error) {
      console.log(error);
      if ((error.code = "auth/id-token-expired")) {
        return res.status("500").json({ errors: { msg: "Token expired" } });
      }
      return res.status("500").json("Server Error");
    }
  } else {
    return res.status(403).json({ errors: "Unauthorized" });
  }
};
