const userController = require("../controllers/userController");
const express = require("express");
const router = express.Router();

// Sign In
router.post("/user/signin", userController.signIn);

// Sign Up
router.post("/user/signup", userController.signUp);

module.exports = router;
