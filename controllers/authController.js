const slackService = require("../services/slackService");

// GET /auth/slack
exports.redirectToSlackOAuth = (req, res) => {
  const url = slackService.getAuthRedirectUrl();
  return res.redirect(url);
};

// GET /auth/slack/callback
exports.handleSlackCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Missing code in query string!");
  }

  try {
    const result = await slackService.exchangeCodeForToken(code);
    if (result.ok) {
      // Tokens are stored in memory inside slackService.
      console.log(
        `Slack Authentication Successful! BOT_Team_ID: ${result.teamId}, Bot_Token: ${result.botToken}`
      );
      // console.log(`Your scopes: ${result.scopes}`);
      return res.send("Slack Authentication Successful! You can close this tab now.");
    } else {
      console.error("OAuth failed:", result.error);
      return res.status(500).send(`OAuth failed: ${result.error}`);
    }
  } catch (err) {
    console.error("Error in Slack Authentication:", err.message);
    return res.status(500).send("Internal Error during Auth");
  }
};
