const feedbackController = require("../controllers/feedbackController");
const authentication = require("../middlewares/authentication");
const express = require("express");
const router = express.Router();

router.get(
  "/products/:product_id/reviews",
  authentication.verifyToken,
  feedbackController.getAllReviews
);
router.post(
  "/products/:product_id/reviews",
  authentication.verifyToken,
  feedbackController.addReview
);

module.exports = router;
