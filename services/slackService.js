require("dotenv").config();
const axios = require("axios");
const querystring = require("querystring");
const { WebClient, LogLevel } = require("@slack/web-api");

/**
 * In-memory storage for this simple demo.
 * In a real app you’d store these in a database or encrypted secrets store.
 */
let BOT_TOKEN = null;
let BOT_TEAM_ID = null;

// The OAuth scopes your app needs:
const SCOPES = [
  "chat:write",
  "chat:write.public",
  "channels:history",
  "commands",
  "im:write",
  "im:read",
  "channels:read",
  "app_mentions:read",
  "channels:join",
  "metadata.message:read",
  "conversations.connect:manage",
];

/**
 * Returns the full URL to redirect a user for Slack OAuth.
 */
function getAuthRedirectUrl() {
  const scopeString = SCOPES.join(",");
  const params = querystring.stringify({
    client_id: process.env.Slack_Client_ID,
    scope: scopeString,
    redirect_uri: process.env.Slack_Redirect_URI,
  });
  return `https://slack.com/oauth/v2/authorize?${params}`;
}

/**
 * Exchanges the code for a BOT_TOKEN and stores it in memory.
 * Returns an object: { ok, teamId, botToken, scopes, error? }
 */
async function exchangeCodeForToken(code) {
  try {
    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      null,
      {
        params: {
          code: code,
          client_id: process.env.Slack_Client_ID,
          client_secret: process.env.Slack_Client_Secret,
          redirect_uri: process.env.Slack_Redirect_URI,
        },
      }
    );

    if (response.data.ok) {
      BOT_TOKEN = response.data.access_token;
      BOT_TEAM_ID = response.data.team.id;
      return {
        ok: true,
        teamId: response.data.team.id,
        botToken: response.data.access_token,
        scopes: response.data.scope,
      };
    } else {
      return { ok: false, error: response.data.error };
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

function isBotTokenSet() {
  return BOT_TOKEN !== null;
}

/**
 * Returns a WebClient initialized with the stored BOT_TOKEN.
 * Throws if BOT_TOKEN is missing.
 */
function getWebClient() {
  if (!BOT_TOKEN) {
    throw new Error("Bot token not set.");
  }
  return new WebClient(BOT_TOKEN, { logLevel: LogLevel.DEBUG });
}

/**
 * 1) Send a new message to a channel or user.
 *    If `user` is provided, opens a DM first and then posts there.
 * 2) Returns Slack’s response: { channel, ts, … } or throws on error.
 */
async function postMessage({ channel, user, text }) {
  const slackClient = getWebClient();
  let targetChannelId = channel;

  if (user) {
    const openResponse = await slackClient.conversations.open({ users: user });
    if (!openResponse.ok) {
      const error = openResponse.error || "unknown_error";
      const e = new Error("Failed to open DM");
      e.slackError = error;
      throw e;
    }
    targetChannelId = openResponse.channel.id;
  }

  const postResponse = await slackClient.chat.postMessage({
    channel: targetChannelId,
    text: text,
  });

  if (!postResponse.ok) {
    const e = new Error("Slack API error posting message");
    e.slackError = postResponse.error;
    throw e;
  }

  return {
    channel: postResponse.channel,
    ts: postResponse.ts,
    text: postResponse.message?.text,
  };
}

/**
 * Schedule a message for future delivery.
 * Returns Slack’s response: { channel, scheduled_message_id, post_at, … } or throws.
 */
async function scheduleMessage({ channel, text, post_at }) {
  const slackClient = getWebClient();
  const scheduleResponse = await slackClient.chat.scheduleMessage({
    channel: channel,
    text: text,
    post_at: post_at,
  });

  if (!scheduleResponse.ok) {
    const e = new Error("Slack API error scheduling message");
    e.slackError = scheduleResponse.error;
    throw e;
  }

  return {
    channel: scheduleResponse.channel,
    scheduled_message_id: scheduleResponse.scheduled_message_id,
    post_at: scheduleResponse.post_at,
  };
}

/**
 * Fetch messages in a channel between oldest and latest (inclusive).
 * Returns Slack’s conversations.history result or throws.
 */
async function fetchMessages({ channel, oldest, latest }) {
  const slackClient = getWebClient();
  const historyResponse = await slackClient.conversations.history({
    channel: channel,
    oldest: oldest,
    latest: latest,
    inclusive: true,
  });

  if (!historyResponse.ok) {
    const e = new Error("Slack API error fetching history");
    e.slackError = historyResponse.error;
    throw e;
  }

  return {
    messages: historyResponse.messages,
    has_more: historyResponse.has_more,
  };
}

/**
 * Edit (update) an existing message by channel+ts.
 * Returns Slack’s response or throws.
 */
async function updateMessage({ channel, ts, text }) {
  const slackClient = getWebClient();
  const updateResponse = await slackClient.chat.update({
    channel: channel,
    ts: ts,
    text: text,
  });

  if (!updateResponse.ok) {
    const e = new Error("Slack API error editing message");
    e.slackError = updateResponse.error;
    throw e;
  }

  return {
    channel: updateResponse.channel,
    ts: updateResponse.ts,
    text: updateResponse.text,
  };
}

/**
 * Delete a message by channel+ts. ts = timestamp of the message to delete.
 * Returns Slack’s response or throws an error.
 */
async function deleteMessage({ channel, ts }) {
  const slackClient = getWebClient();
  const deleteResponse = await slackClient.chat.delete({
    channel: channel,
    ts: ts,
  });

  if (!deleteResponse.ok) {
    const e = new Error("Slack API error deleting message");
    e.slackError = deleteResponse.error;
    throw e;
  }

  return {
    channel: deleteResponse.channel,
    ts: deleteResponse.ts,
  };
}

module.exports = {
  getAuthRedirectUrl,
  exchangeCodeForToken,
  isBotTokenSet,
  postMessage,
  scheduleMessage,
  fetchMessages,
  updateMessage,
  deleteMessage,
};
