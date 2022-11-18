const express = require("express");
const { loginUser, signupUser } = require("../controller/userController");
const router = express.Router();

router.use(express.urlencoded({ extended: false }));
router.route("/login").post(loginUser);
router.route("/signup").post(signupUser);

module.exports = router;
