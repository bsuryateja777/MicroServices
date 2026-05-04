const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token; // or headers

    if (!token) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // 👈 IMPORTANT

    next();

  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
