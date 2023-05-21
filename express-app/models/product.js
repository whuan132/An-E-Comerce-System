const { MongoClient, ObjectId } = require("mongodb");
const Env = require("../env");

/**
 * {
 *     _id: ObjectId,
 *     name: String,
 *     images: String,
 *     category: String,
 *     price: Number,
 *     review: {
 *         score: Number, //average of all stars
 *         feedbacks: [
 *             {
 *                 _id: ObjectId
 *                 stars: Number,//1, 2, 3, 4, 5
 *                 comment: String
 *             }
 *         ]
 *     },
 *     time: String,
 * }
 */

let colProduct = null;
const getProductCollection = async () => {
  if (colProduct) {
    return colProduct;
  }
  const client = new MongoClient(Env.dbUri);
  await client.connect();
  const db = client.db(Env.dbName);
  colProduct = db.collection("Product");
  return colProduct;
};
getProductCollection();

// Add a new product
exports.addProduct = async (obj) => {
  let ret = null;
  try {
    const col = await getProductCollection();
    obj._id = new ObjectId();
    obj.time = Date.now();
    obj.review = { score: 0, feedbacks: [] };
    ret = await col.insertOne(obj);
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// Get all of the products
exports.getAllProducts = async () => {
  let ret = null;
  try {
    const col = await getProductCollection();
    ret = await col.find({}).toArray();
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// Get a product
exports.getProduct = async (product_id) => {
  let ret = null;
  try {
    const col = await getProductCollection();
    ret = await col.findOne({ _id: new ObjectId(product_id) });
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// Update a product
exports.updateProduct = async (product_id, obj) => {
  let ret = null;
  try {
    const col = await getProductCollection();
    for (let e in obj) {
      ret = await col.updateOne(
        {
          _id: new ObjectId(product_id),
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

// Delete a product
exports.deleteProduct = async (product_id) => {
  let ret = null;
  try {
    const col = await getProductCollection();
    ret = col.deleteOne({ _id: new ObjectId(product_id) });
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// Add a new feedback
exports.addFeedback = async (product_id, obj) => {
  let ret = null;
  try {
    const col = await getProductCollection();
    obj._id = new ObjectId();
    ret = await col.updateOne(
      { _id: new ObjectId(product_id) },
      {
        $push: { "review.feedbacks": obj },
      }
    );
    // cal average stars of feedbacks
    const product = await col.findOne({ _id: new ObjectId(product_id) });
    if (product) {
      const feedbacks = product.review.feedbacks || [];
      let sum = 0;
      feedbacks.forEach((f) => {
        sum += f.stars;
      });
      await col.updateOne(
        { _id: new ObjectId(product_id) },
        { $set: { "review.score": sum / feedbacks.length } }
      );
    }
  } catch (err) {
    console.log(err);
  }
  return ret;
};
