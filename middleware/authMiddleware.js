const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Format: Bearer <token>
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
