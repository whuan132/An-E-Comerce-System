const { MongoClient, ObjectId } = require("mongodb");
const Env = require("../env");

/**
 * {
 *      _id: ObjectId,
 *      email: String,
 *      password: String,
 *      role: String, //customer or admin,
 *      time: String,
 *      disable: Boolean, //A disable user cannot login to system
 * }
 */

let colUser = null;
const getUserCollection = async () => {
  if (colUser) {
    return colUser;
  }
  const client = new MongoClient(Env.dbUri);
  await client.connect();
  const db = client.db(Env.dbName);
  colUser = db.collection("User");
  return colUser;
};
getUserCollection();

// get a customer by email
exports.getUserByEmail = async (email) => {
  let ret = null;
  try {
    const col = await getUserCollection();
    ret = await col.findOne({ email: email.toLowerCase() });
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// get a customer by email
exports.getAllUsers = async () => {
  let ret = null;
  try {
    const col = await getUserCollection();
    ret = await col.find({}).toArray();
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// insert a new customer
exports.insert = async (obj) => {
  let ret = null;
  try {
    if (!obj || !obj.email) {
      return ret;
    }
    const col = await getUserCollection();
    const temp = await col.findOne({ email: obj.email.toLowerCase() });
    if (temp == null) {
      obj._id = new ObjectId();
      obj.email = obj.email.toLowerCase();
      obj.time = Date.now();
      obj.disable = false;
      ret = await col.insertOne(obj);
    }
  } catch (err) {
    console.log(err);
  }
  return ret;
};

// Update a customer
exports.updateUser = async (user_id, obj) => {
  let ret = null;
  try {
    const col = await getUserCollection();
    for (let e in obj) {
      ret = await col.updateOne(
        {
          _id: new ObjectId(user_id),
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
