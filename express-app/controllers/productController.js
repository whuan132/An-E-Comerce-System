const product = require("../models/product");
const Env = require("../env");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const ret = await product.getAllProducts();
    res.send({ code: 0, data: ret || [] });
  } catch (err) {
    console.log(err);
    res.send({ code: 500, data: err.message });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const ret = await product.addProduct(req.body);
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

// Update a product
exports.updatePruduct = async (req, res) => {
  try {
    const ret = await product.updateProduct(req.params.product_id, req.body);
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

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const ret = await product.deleteProduct(req.params.product_id);
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
