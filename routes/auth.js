const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// GET /auth/slack
router.get("/slack", authController.redirectToSlackOAuth);

// GET /auth/slack/callback
router.get("/slack/callback", authController.handleSlackCallback);

module.exports = router;
