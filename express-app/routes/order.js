const orderController = require("../controllers/orderController");
const authentication = require("../middlewares/authentication");
const express = require("express");
const router = express.Router();

router.post(
  "/user/:user_id/orders",
  authentication.verifyCustomerToken,
  orderController.addOrder
);
router.get(
  "/user/:user_id/orders",
  authentication.verifyCustomerToken,
  orderController.getAllOrders
);
router.patch(
  "/user/:user_id/orders/:order_id/return",
  authentication.verifyCustomerToken,
  orderController.returnOrder
);

module.exports = router;
