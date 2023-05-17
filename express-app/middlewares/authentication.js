const jwt = require("jsonwebtoken");
const Env = require("./env");

/**
 * JWT middleware
 */
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (typeof token !== "undefined") {
    jwt.verify(token, Env.secretKey, (err, decoded) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};

module.exports = verifyToken;
