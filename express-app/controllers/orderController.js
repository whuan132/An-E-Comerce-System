const order = require("../models/order");
const Env = require("../env");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const ret = await order.getAllOrders(req.params.user_id);
    res.send({ code: 0, data: ret || [] });
  } catch (err) {
    console.log(err);
    res.send({ code: 500, data: err.message });
  }
};

// Add an order
exports.addOrder = async (req, res) => {
  try {
    const ret = await order.addOrder(req.params.user_id, req.body);
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

// Return an order
exports.returnOrder = async (req, res) => {
  try {
    const ret = await order.updateOrder(req.params.order_id, {
      status: "canceled",
    });
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
