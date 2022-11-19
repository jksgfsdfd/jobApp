const express = require("express");
const {
  loginUser,
  signupUser,
  deleteUser,
} = require("../controller/userController");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router();

router.use(express.urlencoded({ extended: false }));
router.route("/login").post(loginUser);
router.route("/signup").post(signupUser);
router.use("/delete", verifyUser);
router.route("/delete").post(deleteUser);

module.exports = router;
