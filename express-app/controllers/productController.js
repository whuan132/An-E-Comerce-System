const product = require("../models/product");
const Env = require("../env");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const ret = product.getAllProducts();
    res.json(ret || []);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const ret = product.addProduct(req.body);
    if (ret) {
      res.json(ret);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Update product
