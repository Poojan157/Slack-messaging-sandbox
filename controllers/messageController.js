const slackService = require("../services/slackService");

// POST /message/send
exports.sendMessage = async (req, res) => {
  const { channel, user, text } = req.body;
  if (!text || (!channel && !user)) {
    return res.status(400).json({
      ok: false,
      error: "Bad Request: Provide `text` and either `channel` or `user` in the body.",
    });
  }

  if (!slackService.isBotTokenSet()) {
    return res.status(500).json({
      ok: false,
      error: "Bot token not set. Complete OAuth flow before sending messages.",
    });
  }

  try {
    const response = await slackService.postMessage({ channel, user, text });
    return res.json({
      ok: true,
      channel: response.channel,
      ts: response.ts,
    });
  } catch (err) {
    console.error("Error in POST /message/send:", err.slackError || err.message);
    return res.status(500).json({
      ok: false,
      error: err.slackError || err.message || "Unknown error",
    });
  }
};

// POST /message/schedule
exports.scheduleMessage = async (req, res) => {
  const { channel, text, post_at } = req.body;
  if (!channel || !text || post_at === undefined) {
    return res.status(400).json({
      ok: false,
      error: "Missing required field(s): `channel`, `text`, and `post_at` are all required.",
    });
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (typeof post_at !== "number" || post_at <= nowInSeconds) {
    return res.status(400).json({
      ok: false,
      error: "`post_at` must be a Unix timestamp (in seconds) strictly greater than the current time.",
    });
  }

  if (!slackService.isBotTokenSet()) {
    return res.status(500).json({
      ok: false,
      error: "Bot token is not set. Please complete the OAuth flow before scheduling messages.",
    });
  }

  try {
    const scheduleResponse = await slackService.scheduleMessage({ channel, text, post_at });
    return res.json({
      ok: true,
      scheduled_message_id: scheduleResponse.scheduled_message_id,
      post_at: scheduleResponse.post_at,
      channel: scheduleResponse.channel,
    });
  } catch (err) {
    console.error("Internal error in POST /message/schedule:", err.slackError || err.message);
    return res.status(500).json({
      ok: false,
      error: err.slackError || err.message || "Unknown error while scheduling message.",
    });
  }
};

// GET /message/get
exports.getMessages = async (req, res) => {
  const channelId = req.query.channel;
  const oldest = req.query.oldest;
  const latest = req.query.latest;

  if (!channelId || !oldest || !latest) {
    return res.status(400).json({
      ok: false,
      error: "Bad Request: Query parameters `channel`, `oldest`, and `latest` are all required.",
    });
  }

  if (!slackService.isBotTokenSet()) {
    return res.status(500).json({
      ok: false,
      error: "Bot token is not set. Complete the OAuth flow first.",
    });
  }

  try {
    const history = await slackService.fetchMessages({
      channel: channelId,
      oldest: parseFloat(oldest),
      latest: parseFloat(latest),
    });
    return res.json({
      ok: true,
      messages: history.messages || [],
    });
  } catch (err) {
    console.error("Internal error in GET /message/get:", err.slackError || err.message);
    return res.status(500).json({
      ok: false,
      error: err.slackError || err.message || "Unknown error",
    });
  }
};

// POST /message/edit
exports.editMessage = async (req, res) => {
  const { channel, ts, text } = req.body;
  if (!channel || !ts || !text) {
    return res.status(400).json({
      ok: false,
      error: "Bad Request: Provide `channel`, `ts`, and `text` in the body.",
    });
  }

  if (!slackService.isBotTokenSet()) {
    return res.status(500).json({
      ok: false,
      error: "Bot token not set. Complete OAuth flow before editing messages.",
    });
  }

  try {
    const updateResponse = await slackService.updateMessage({ channel, ts, text });
    return res.json({
      ok: true,
      channel: updateResponse.channel,
      ts: updateResponse.ts,
      text: updateResponse.text,
    });
  } catch (err) {
    console.error("Error in POST /message/edit:", err.slackError || err.message);
    return res.status(500).json({
      ok: false,
      error: err.slackError || err.message || "Unknown error",
    });
  }
};

// POST /message/delete
exports.deleteMessage = async (req, res) => {
  const { channel, ts } = req.body;
  if (!channel || !ts) {
    return res.status(400).json({
      ok: false,
      error: "Bad Request: Provide `channel` and `ts` in the body.",
    });
  }

  if (!slackService.isBotTokenSet()) {
    return res.status(500).json({
      ok: false,
      error: "Bot token not set. Complete OAuth flow before deleting messages.",
    });
  }

  try {
    const deleteResponse = await slackService.deleteMessage({ channel, ts });
    return res.json({
      ok: true,
      channel: deleteResponse.channel,
      ts: deleteResponse.ts,
    });
  } catch (err) {
    console.error("Error in POST /message/delete:", err.slackError || err.message);
    return res.status(500).json({
      ok: false,
      error: err.slackError || err.message || "Unknown error",
    });
  }
};
