const express = require("express");
const { sendConnectionRequest, reviewConnectionRequest } = require("../controllers/connectionRequestController");
const { protect } = require("../controllers/userController");

const router = express.Router();

router.route("/request/send/:status/:toUserId").post(protect ,sendConnectionRequest)
router.route("/request/review/:status/:requestId").post(protect ,reviewConnectionRequest)

module.exports = router;