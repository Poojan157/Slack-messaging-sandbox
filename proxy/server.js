/**
 * server.js
 *
 * This Express.js server acts as a simple HTTP proxy. It forwards all incoming requests
 * on port 7000 to an internal backend running on port 3000. This setup is useful when
 * deploying on platforms like Replit, where your backend needs to be exposed through
 * a publicly accessible URL.
 *
 * Setup & Usage Instructions:
 *
 * 1. On Replit:
 *    - Add this file (`server.js`) to your Replit project.
 *    - Make sure your Replit project’s package.json includes these dependencies:
 *        {
 *          "dependencies": {
 *            "express": "^4.18.2",
 *            "http-proxy-middleware": "^2.0.6"
 *          }
 *        }
 *      Then run `npm install` in the Replit console.
 *
 *    - In your Replit `.env` file, add:
 *        SLACK_REDIRECT_URL=https://<your-repl-name>.<username>.repl.co/auth/slack/callback
 *
 *      Replace `<your-repl-name>.<username>.repl.co` with the actual Replit-generated URL
 *      (displayed in the Replit sidebar after you click “Run”).
 *
 *    - In your Slack App configuration, navigate to “OAuth & Permissions” → “Redirect URLs”
 *      and add:
 *        https://<your-repl-name>.<username>.repl.co/auth/slack/callback
 *      Then click “Save URLs”.
 *
 *    - In the same `.env` file, set:
 *        SLACK_REDIRECT_URL=https://<your-repl-name>.<username>.repl.co/auth/slack/callback
 *
 *      This ensures your backend knows where to expect Slack’s OAuth responses.
 *
 *    - Click “Run” in Replit. The console will show something like:
 *        “Your project is running at https://<your-repl-name>.<username>.repl.co”
 *      Note that URL—this is your public entrypoint (port 7000).
 *
 *    - Once the proxy is running on port 7000, you can point Slack’s OAuth Redirect URL
 *      to:
 *        https://<your-repl-name>.<username>.repl.co/auth/slack/callback
 *
 *    - After that, start your main backend application separately (on port 3000). All
 *      requests coming in to `https://<your-repl-name>.<username>.repl.co/proxy/...`
 *      will be forwarded to `http://127.0.0.1:3000/...`.
 *
 * 2. If you are not using Replit (local development):
 *    - Install ngrok globally if you haven’t already:
 *        npm install -g ngrok
 *
 *    - Run this proxy server locally on port 7000:
 *        node server.js
 *
 *    - In another terminal, start ngrok on port 7000:
 *        ngrok http 7000
 *
 *      ngrok will generate a public URL like `https://a1b2c3d4.ngrok.io`. Copy that URL.
 *
 *    - In your Slack App configuration (“OAuth & Permissions” → “Redirect URLs”), add:
 *        https://a1b2c3d4.ngrok.io/auth/slack/callback
 *      and save.
 *
 *    - In your local `.env` file, set:
 *        SLACK_REDIRECT_URL=https://a1b2c3d4.ngrok.io/auth/slack/callback
 *
 *    - Make sure your main backend (on port 3000) is running:
 *        node index.js   // or however you start your main app
 *
 *      Now, any requests to `https://a1b2c3d4.ngrok.io/proxy/...` will be forwarded
 *      to `http://127.0.0.1:3000/...`.
 *
 * -------------------------------------------------------------------------------
 * Code Explanation:
 *
 * - We use Express to spin up a lightweight HTTP server that listens on PORT (7000 by default).
 * - http-proxy-middleware creates a proxy layer so that any request sent to our Replit/ngrok URL
 *   at path `/proxy/...` will be transparently forwarded to the actual backend at `http://127.0.0.1:3000/...`.
 * - changeOrigin: true ensures the Host header in the forwarded request matches the target’s host.
 * - pathRewrite strips the `/proxy` prefix before forwarding, so a request to `/proxy/slack/events`
 *   becomes a request to `/slack/events` on the internal server.
 *
 * - In your Slack app, set the Redirect URL for OAuth to the public URL
 *   plus `/auth/slack/callback`. You then save the same URL in your `.env` under `SLACK_REDIRECT_URL`.
 *
 * - Finally, run your main backend (on port 3000) separately. The proxy does not expose any new routes;
 *   it simply shuttles traffic from port 7000 → port 3000.
 * -------------------------------------------------------------------------------
 */

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Use the PORT from environment variables (Replit sets this automatically), or default to 7000.
// This is the public port that external services (Slack, etc.) will hit.
const PORT = process.env.PORT || 7000;

// The internal backend (your main application) is running locally on port 3000.
// The proxy will forward incoming requests to this target.
const TARGET_INTERNAL = "http://127.0.0.1:3000";

const app = express();

// Proxy middleware: forwards all requests sent to "/" (with optional "/proxy" prefix)
// to the internal backend. In Replit, your public URL will be something like:
//   https://<your-repl-name>.<username>.repl.co/proxy/...
//
// The pathRewrite setting strips the "/proxy" prefix before forwarding, so if Slack
// sends something to "/proxy/slack/events", it becomes "/slack/events" on port 3000.
//
// If you don’t want to use "/proxy" as a prefix, simply remove pathRewrite and hit
// Slack requests directly at https://<your-public-url>/...
app.use(
  "/",
  createProxyMiddleware({
    target: TARGET_INTERNAL,
    changeOrigin: true,
    pathRewrite: {
      "^/proxy": "", // Remove "/proxy" prefix before sending to internal server
    },
  })
);

// Start listening on the specified port (7000). Replit will automatically expose this port.
// Once running, the console will log the proxy mapping for quick reference.
app.listen(PORT, () => {
  console.log(
    `Combined Repl listening on port ${PORT}. ` +
      `Proxy at /proxy → ${TARGET_INTERNAL}`
  );
  console.log(
    `Once you run this on Replit, grab the public URL (e.g., https://your-repl-name.username.repl.co)`
  );
  console.log(
    `In Slack App's OAuth & Permissions, add Redirect URL: https://your-repl-name.username.repl.co/auth/slack/callback`
  );
  console.log(
    `Then set SLACK_REDIRECT_URL=https://your-repl-name.username.repl.co/auth/slack/callback in your .env.`
  );
  console.log(
    `If you’re developing locally, run 'node server.js' and then 'ngrok http ${PORT}'. Use the ngrok URL instead.`
  );
});
