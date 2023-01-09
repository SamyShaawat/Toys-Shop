const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userrouter = require("./router/userRouter");
const itemrouter = require("./router/itemsRouter");
const cartrouter = require("./router/cartRouter");


dotenv.config({ path: "./config.env" });
const connect = require("./db/connection");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use("/api/user", userrouter);
app.use("/api/items", itemrouter);
app.use("/api/cart", cartrouter);


const port = process.env.PORT || 8080;

connect
  .then((res) => {
    app.listen(port, () => {
      console.log(`Server is runing on PORT: ${port}`);
    });
  })
  .catch((err) => {
    console.log(`DB error: ${err}`);
  });

