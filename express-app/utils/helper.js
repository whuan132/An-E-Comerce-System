const crypto = require("crypto");
const Env = require("../env");

exports.hash = (input) => {
  const hash = crypto.createHash("sha256");
  hash.update(input + Env.secretKey);
  return hash.digest("hex");
};
