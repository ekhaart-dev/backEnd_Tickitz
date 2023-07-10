const express = require("express");
const main = express();
const routers = require("./src/router");
const db = require("./src/config/db");
const cors = require("cors");
require("dotenv").config();

main.use(
  cors({
    allowedHeaders: "*",
    origin: "*",
    methods: "*",
    exposedHeaders: "*",
  })
);
main.use(express.json());
main.use(express.urlencoded({ extended: true }));
main.use(routers);

db.connect()
  .then(() => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    main.listen(4000, () => {
      console.log("app running on port 4000");
    });
  })
  .catch((e) => {
    console.log(e);
  });
