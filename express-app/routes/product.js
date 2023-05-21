const productController = require("../controllers/productController");
const authentication = require("../middlewares/authentication");
const express = require("express");
const router = express.Router();

router.get(
  "/products",
  authentication.verifyToken,
  productController.getAllProducts
);
router.post("/products", productController.addProduct);
router.patch(
  "/products/:product_id",
  authentication.verifyAdminToken,
  productController.updatePruduct
);
router.delete(
  "/products/:product_id",
  authentication.verifyAdminToken,
  productController.deleteProduct
);

module.exports = router;
