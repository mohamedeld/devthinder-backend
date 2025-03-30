const express = require("express");
const { sendConnectionRequest } = require("../controllers/connectionRequestController");
const { protect } = require("../controllers/userController");

const router = express.Router();

router.route("/request/send/:status/:toUserId").post(protect ,sendConnectionRequest)

module.exports = router;