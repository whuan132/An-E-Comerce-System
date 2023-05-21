const orderController = require("../controllers/orderController");
const express = require("express");
const router = express.Router();

router.post("/user/:user_id/orders", orderController.addOrder);
router.get("/user/:user_id/orders", orderController.getAllOrders);
router.patch(
  "/user/:user_id/orders/:order_id/return",
  orderController.returnOrder
);

module.exports = router;
