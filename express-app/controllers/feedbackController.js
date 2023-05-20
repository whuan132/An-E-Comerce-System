const product = require("../models/product");
const Env = require("../env");

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const ret = await product.getProduct(req.params.product_id);
    res.send({ code: 0, data: ret.review.feedbacks || [] });
  } catch (err) {
    console.log(err);
    res.send({ code: 500, data: err.message });
  }
};

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const ret = await product.addFeedback(req.params.product_id, req.body);
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
