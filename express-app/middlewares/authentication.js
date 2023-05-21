const jwt = require("jsonwebtoken");
const Env = require("../env");

/**
 * JWT middleware
 */
exports.verifyToken = (req, res, next) => {
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

exports.verifyAdminToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (typeof token !== "undefined") {
    jwt.verify(token, Env.secretKey, (err, decoded) => {
      if (err || decoded.role !== "admin") {
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

exports.verifyCustomerToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (typeof token !== "undefined") {
    jwt.verify(token, Env.secretKey, (err, decoded) => {
      if (
        err ||
        (decoded.role !== "admin" && decoded._id !== req.params.user_id)
      ) {
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
