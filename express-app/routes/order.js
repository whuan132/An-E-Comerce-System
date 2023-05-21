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

router.get(
  "/orders",
  authentication.verifyAdminToken,
  orderController.getAllOrders
);
router.delete(
  "/orders/:order_id",
  authentication.verifyAdminToken,
  orderController.deleteOrder
);
router.patch(
  "/orders/:order_id/delivery",
  authentication.verifyAdminToken,
  orderController.deliveryOrder
);

module.exports = router;
