const express = require("express");

const index = express();

const mongoose = require("mongoose");

const cors = require("cors");
const path = require("path");
const statusText = require("./utilities/httpStatusText");

index.use("/uploads", express.static(path.join(__dirname, "uploads")));

require("dotenv").config();

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
  console.log("Server Started");
});

index.use(express.json());

const courseRoute = require("./Routes/courses.route");

const usersRoute = require("./Routes/users.route");

index.use(cors());

index.use("/api/courses", courseRoute);

index.use("/api/users", usersRoute);

index.all("*", (req, res) => {
  res.status(404).json({
    status: statusText.ERROR,
    message: "This Resource isn't available",
  });
});

index.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || statusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

index.listen(8080, () => {
  console.log("Server is Working! on port 8080");
});
