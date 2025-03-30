const express = require("express");
const { login, logout, signUp } = require("../controllers/userController");

const router = express.Router();

router.route("/signup").post(signUp)
router.route("/login").post(login);
router.route("/logout").post(logout)
module.exports = router;