const jwt = require("jsonwebtoken");
const user = require("../models/user");
const Env = require("../env");
const Helper = require("../utils/helper");

// customer sign in
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ret = await user.getUserByEmail(email);
    if (ret && ret.password === Helper.hash(password)) {
      const token = jwt.sign(ret, Env.secretKey);
      res.json({ token });
    } else {
      res.status(403).json({ message: "error" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// customer sign up
exports.signUp = async (req, res) => {
  try {
    const obj = { ...req.body, password: Helper.hash(req.body.password) };
    const ret = await user.insert(obj);
    if (ret) {
      const token = jwt.sign(ret, Env.secretKey);
      res.json({ token });
    } else {
      res.status(403).json({ message: "error" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
