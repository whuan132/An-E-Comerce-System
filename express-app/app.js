const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Env = require("./env");
const app = express();

//app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({ origin: "*" }));
app.use(require("./routes/user"));
app.use(require("./routes/product"));
app.use(require("./routes/order"));
app.use(require("./routes/feedback"));

/**
 * Start server
 */
app.listen(Env.port, () => {
  console.log(`Example app listening on port ${Env.port}`);
});
