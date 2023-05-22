const jwt = require("jsonwebtoken");
const user = require("../models/user");
const Env = require("../env");
const Helper = require("../utils/helper");

// customer sign in
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ret = await user.getUserByEmail(email);
    if (ret && !ret.disable && ret.password === Helper.hash(password)) {
      const token = jwt.sign(ret, Env.secretKey);
      res.send({
        code: 0,
        data: {
          token: token,
          role: ret.role,
          id: ret._id,
          email: ret.email,
          time: ret.time,
        },
      });
    } else {
      res.send({ code: 403, data: "error" });
    }
  } catch (err) {
    console.log(err);
    res.send({ code: 500, data: err.message });
  }
};

// customer sign up
exports.signUp = async (req, res) => {
  try {
    const obj = { ...req.body, password: Helper.hash(req.body.password) };
    obj.role = "customer";
    const ret = await user.insert(obj);
    if (ret) {
      const token = jwt.sign(ret, Env.secretKey);
      res.json({ code: 0 });
    } else {
      res.send({ code: 403, data: "error" });
    }
  } catch (err) {
    console.log(err);
    res.send({ code: 500, data: err.message });
  }
};

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const ret = await user.getAllUsers();
    ret &&
      ret.forEach((e) => {
        delete e.password;
      });
    res.send({ code: 0, data: ret || [] });
  } catch (err) {
    console.log(err);
    res.send({ code: 500, data: err.message });
  }
};

// Update an user
exports.updateUser = async (req, res) => {
  try {
    const ret = await user.updateUser(req.params.user_id, req.body);
    if (ret) {
      res.send({ code: 0, data: ret });
    } else {
      res.send({ code: 403, data: "error" });
    }
  } catch (err) {
    console.log(err);
    res.send({ code: 500, data: err.message });
  }
};

// Add an admin user
exports.addAdminUser = async (req, res) => {
  try {
    const obj = { ...req.body, password: Helper.hash(req.body.password) };
    obj.role = "admin";
    const ret = await user.insert(obj);
    if (ret) {
      res.json({ code: 0 });
    } else {
      res.send({ code: 403, data: "error" });
    }
  } catch (err) {
    console.log(err);
    res.send({ code: 500, data: err.message });
  }
};
