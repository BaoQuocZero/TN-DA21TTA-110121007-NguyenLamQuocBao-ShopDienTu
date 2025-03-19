const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3307;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const configViewEngine = require("./config/ViewEngine");

const corsOptions = {
  origin: process.env.URL_REACT, // Cho phép truy cập từ tất cả các nguồn
  credentials: true, // Cho phép gửi cookie
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

configViewEngine(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
