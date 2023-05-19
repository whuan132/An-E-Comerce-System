const productController = require("../controllers/productController");
const express = require("express");
const router = express.Router();

router.get("/products", productController.getAllProducts);
router.post("/products", productController.addProduct);
router.patch("/products/:product_id", productController.updatePruduct);
router.delete("/products/:product_id", productController.deleteProduct);

module.exports = router;
