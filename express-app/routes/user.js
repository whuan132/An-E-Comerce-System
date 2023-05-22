const userController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const express = require("express");
const router = express.Router();

// Sign In
router.post("/user/signin", userController.signIn);

// Sign Up
router.post("/user/signup", userController.signUp);

router.get(
  "/users",
  authentication.verifyAdminToken,
  userController.getAllUsers
);

router.patch(
  "/users/:user_id",
  authentication.verifyAdminToken,
  userController.updateUser
);
router.post(
  "/users/addadmin",
  authentication.verifyAdminToken,
  userController.addAdminUser
);

module.exports = router;
