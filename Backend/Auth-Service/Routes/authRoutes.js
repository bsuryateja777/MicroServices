const express = require("express");
const router = express.Router();
const { register, login, profile, logout } = require("../Controllers/authControllers");
const {verifyToken} = require ("../Middleware/VerifyToken")

router.post("/register", register);
router.post("/login", login)
router.get("/profile", verifyToken, profile)
router.post("/logout", verifyToken, logout)


module.exports = router;