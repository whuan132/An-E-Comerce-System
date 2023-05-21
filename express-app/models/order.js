const { MongoClient, ObjectId } = require("mongodb");
const Env = require("../env");

/**
 * {
 *    _id: ObjectId,
 *    userId: ObjectId,
 *    products: [
 *        {
 *            name: String,
 *            price: Number,
 *            quantity: Number
 *        }
 *    ],
 *    total: Number, // sum of all (product.price * quantity)
 *    payment: String, //card or cash
 *    time: String,
 *    status: String, //ordered, delivered, or canceled
 * }
 */

let colOrder = null;
const getOrderCollection = async () => {
  if (colOrder) {
    return colOrder;
  }
  const client = new MongoClient(Env.dbUri);
  await client.connect();
  const db = client.db(Env.dbName);
  colOrder = db.collection("Order");
  return colOrder;
};
getOrderCollection();

// Update order's total
const updateTotal = async (order_id) => {
  let ret = null;
  try {
    const col = await getOrderCollection();
    const order = await col.findOne({ _id: new ObjectId(order_id) });
    if (order) {
      const products = order.products || [];
      let total = 0;
      products.forEach((p) => {
        total += p.price * p.quantity;
      });
      ret = await col.updateOne(
        {
          _id: new ObjectId(order_id),
        },
        {
          $set: { total: total },
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
  return ret;
};
exports.updateTotal = updateTotal;

// Add a new order
exports.addOrder = async (user_id, obj) => {
  let ret = null;
  try {
    const col = await getOrderCollection();
    obj._id = new ObjectId();
    obj.userId = new ObjectId(user_id);
    obj.time = Date.now();
    obj.status = "ordered";
    ret = await col.insertOne(obj);
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// Get all of orders
exports.getAllOrders = async (user_id) => {
  let ret = null;
  try {
    const col = await getOrderCollection();
    if (!!user_id) {
      ret = await col.find({ userId: new ObjectId(user_id) }).toArray();
    } else {
      ret = await col.find({}).toArray();
    }
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// Update a order
exports.updateOrder = async (order_id, obj) => {
  let ret = null;
  try {
    const col = await getOrderCollection();
    for (let e in obj) {
      ret = await col.updateOne(
        {
          _id: new ObjectId(order_id),
        },
        {
          $set: { [e]: obj[e] },
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// Add a new product
exports.addProduct = async (order_id, obj) => {
  let ret = null;
  try {
    const col = await getProductCollection();
    obj._id = new ObjectId();
    ret = await col.updateOne(
      { _id: new ObjectId(order_id) },
      {
        $push: { products: obj },
      }
    );
    updateTotal(order_id);
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// Update a product quantity
exports.updateProductQuantity = async (order_id, product_id, quantity) => {
  let ret = null;
  try {
    const col = await getOrderCollection();
    ret = await col.updateOne(
      {
        _id: new ObjectId(order_id),
        "products._id": new ObjectId(product_id),
      },
      {
        $set: { "products.$.quantity": quantity },
      }
    );
    updateTotal(order_id);
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// Delete a product
exports.deleteProduct = async (order_id, product_id) => {
  let ret = null;
  try {
    const col = await getOrderCollection();
    ret = await col.updateOne(
      {
        _id: new ObjectId(order_id),
      },
      {
        $pull: { products: { _id: new ObjectId(product_id) } },
      }
    );
    updateTotal(order_id);
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// Delete an order
exports.deleteOrder = async (order_id) => {
  let ret = null;
  try {
    const col = await getOrderCollection();
    ret = await col.deleteOne({
      _id: new ObjectId(order_id),
    });
  } catch (err) {
    console.log(err);
  }
  return ret;
};
