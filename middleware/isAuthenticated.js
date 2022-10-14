import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = await req.cookies.access_token;
    if (!token) {
      return res.sendStatus(403);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) res.status(403).json("Token is not valid");
      req.user = user;
      console.log("Authenticated User: ", user);
      next();
    });
  } catch (err) {
    console.error("middleware error", err);
    res.status(401).json({ error: "User not authenticated!" });
  }
};

export default isAuthenticated;
