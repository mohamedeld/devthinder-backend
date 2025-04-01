const express = require("express");
const { login, logout, signUp, protect, userConnection, userRequests, userFeed } = require("../controllers/userController");

const router = express.Router();

router.route("/auth/signup").post(signUp)
router.route("/auth/login").post(login);
router.route("/auth/logout").post(logout);

router.route("/user/requests").get(protect,userRequests)
router.route("/user/connection").get(protect,userConnection)
router.route("/user/feed").get(protect,userFeed)
module.exports = router;