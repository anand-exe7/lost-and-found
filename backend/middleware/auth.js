import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.headers["x-auth-token"] || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
}
