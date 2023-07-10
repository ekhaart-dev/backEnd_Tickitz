const express = require("express");
const route = express.Router();
const ctrl = require("../controller/movie");
const authCheck = require("../middleware/authCheck");
const upload = require("../middleware/multer");

//? admin and user can accsess
route.get("/", ctrl.fetchBy);

//! only admin can accsess
route.post("/", authCheck("admin"), upload.single("banner"), ctrl.save);

//! only admin can accsess
route.put("/:id", authCheck("admin"), ctrl.patch);

// //? admin and user can accsess
// route.get("/", ctrl.fetchBy);

// //! only admin can accsess
// route.post("/", upload.single("banner"), ctrl.save);

// //! only admin can accsess
// route.put("/:id", ctrl.patch);

module.exports = route;
