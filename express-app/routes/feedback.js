const feedbackController = require("../controllers/feedbackController");
const express = require("express");
const router = express.Router();

router.get("/products/:product_id/reviews", feedbackController.getAllReviews);
router.post("/products/:product_id/reviews", feedbackController.addReview);

module.exports = router;
