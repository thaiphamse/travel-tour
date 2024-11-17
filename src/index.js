require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
const db = require("./config/db");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require("./MiddleWare/ErrorHandler");
const morgan = require("morgan");

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));

app.use(bodyParser.json());
app.use(cookieParser());

db.connect();

routes(app);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
//Global error handler
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
