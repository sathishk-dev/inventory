const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const {protectedRoute} = require('../middleware/protectedRoute')

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/protected", protectedRoute);

module.exports = router;