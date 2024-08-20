const express = require("express");
const dotenv = require("dotenv");
dotenv.config;
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
const db = require("./config/db");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cors());
db.connect();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

app.use(bodyParser.json());
app.use(cookieParser());

routes(app);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
