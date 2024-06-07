const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const db = require("./database/db");

app.use(express.json());
app.use(cors({ origin: "*" }));


app.use("/users",require("./routes/user"));
app.use('/subscriptions',require("./routes/subscriptions"))
app.use("/orders",require("./routes/orders"))


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });
  
  
  app.listen(process.env.PORT, async () => {
    await db();
    console.log(`Servers up on port ${process.env.PORT}`);
  });