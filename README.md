# Slack-Messaging-Sandbox 🚀

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18%2B-blue.svg)](https://expressjs.com/)
[![Slack API](https://img.shields.io/badge/Slack%20API-Web%20API-purple.svg)](https://api.slack.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**A comprehensive, production-ready Node.js/Express toolkit for seamless Slack integration and message management**

Transform your Slack workspace into a powerful messaging hub with this enterprise-grade sandbox environment. Built for developers who need rapid prototyping, testing, and deployment of Slack bot functionality without the complexity of full-scale applications.

## ✨ What Makes This Special?

🔐 **Complete OAuth Integration** - Handle Slack authentication flows effortlessly with built-in token management and secure credential handling.

💬 **Full Message Lifecycle** - Send, schedule, retrieve, edit, and delete messages with enterprise-grade reliability and error handling.

🎯 **Developer-First Design** - Modular architecture with clear separation of concerns, making it easy to extend, customize, and integrate into existing projects.

🌐 **Deployment Ready** - Works seamlessly with Replit, ngrok, Heroku, and other platforms. Includes optional proxy configuration for complex networking scenarios.

⚡ **Zero Configuration Hassle** - Get up and running in minutes with comprehensive setup guides and environment templates.

Perfect for building Slack bots, automation tools, notification systems, and interactive workplace applications. Whether you're a solo developer experimenting with Slack APIs or a team building the next big workplace productivity tool, this sandbox provides the foundation you need.

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [🛠️ Installation & Setup](#️-installation--setup)
  - [Method 1: Replit Deployment](#method-1-replit-deployment)
  - [Method 2: Local Development with ngrok](#method-2-local-development-with-ngrok)
- [🔌 API Endpoints](#-api-endpoints)
- [📁 Project Structure](#-project-structure)
- [🔧 Advanced Configuration](#-advanced-configuration)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Overview

Slack-Messaging-Sandbox is a modular Express.js application that provides a complete foundation for Slack bot development. It handles the complex OAuth flow, manages Bot Tokens (Access Tokens provided by Slack for API access), and provides a clean RESTful interface for all message operations.

### 🔑 Understanding Slack Bot Tokens

When we refer to "Bot Token" in this documentation, we're talking about the **Access Token** that Slack provides after successful OAuth authentication. This token:
- Grants your application permission to interact with Slack's Web API
- Is prefixed with `xoxb-` for bot tokens
- Must be included in all API requests to Slack
- Is securely managed by our token management system

The application consists of two main components:

1. **Main Backend Server** (`index.js`) - Runs on port 3000, handles all Slack API operations
2. **Proxy Server** (`server.js`) - Runs on port 7000, provides public URL exposure for OAuth callbacks

---

## ✨ Key Features

### 🔐 OAuth & Authentication
- **Automated OAuth Flow**: Complete Slack app authorization with callback handling
- **Secure Token Management**: In-memory storage with automatic token refresh capabilities
- **Multi-Workspace Support**: Handle multiple Slack workspace integrations

### 💬 Message Operations
- **Send Messages**: Direct messages and channel posts with rich formatting
- **Schedule Messages**: Queue messages for future delivery with Unix timestamp support
- **Message History**: Retrieve conversation history with flexible timestamp filtering
- **Edit Messages**: Update existing messages while preserving metadata
- **Delete Messages**: Remove messages with proper error handling

### 🌐 Deployment Flexibility
- **Replit Ready**: One-click deployment with automatic dependency management
- **ngrok Compatible**: Local development with public URL exposure
- **Proxy Architecture**: Handle complex networking scenarios and firewall restrictions
- **Environment Agnostic**: Works across different hosting platforms

### 🏗️ Production Features
- **Modular Architecture**: Clean separation of routes, controllers, and services
- **Error Handling**: Comprehensive error catching and user-friendly responses
- **Request Validation**: Input sanitization and validation for all endpoints
- **Logging**: Built-in request/response logging for debugging

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Slack App     │───▶│  Proxy Server   │───▶│  Main Backend   │
│  (OAuth Flow)   │    │   (Port 7000)   │    │   (Port 3000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │ Public URL      │    │ Slack Web API   │
                    │ Exposure        │    │ Integration     │
                    └─────────────────┘    └─────────────────┘
```

### Component Breakdown

- **Routes**: Define API endpoints and request routing
- **Controllers**: Handle request validation and business logic delegation  
- **Services**: Manage Slack API communication and token operations
- **Proxy**: Enable public access for OAuth callbacks and webhooks

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js v14+** installed on your system
- **npm** package manager (comes with Node.js)
- **Slack App** created in your target workspace
- **Internet connection** for Slack API communication
- (Optional) **Replit account** for cloud deployment
- (Optional) **ngrok** for local development with public URLs

---

## 🚀 Quick Start

Get up and running in under 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Slack-Messaging-Sandbox.git
cd Slack-Messaging-Sandbox

# 2. Install dependencies
npm install

# 3. Set up environment variables (see configuration section)
cp .env.example .env
# Edit .env with your Slack app credentials

# 4. Start the proxy server
node server.js

# 5. In another terminal, start the main backend
node index.js

# 6. Visit the OAuth URL to authorize your Slack app
# Your public URL + /auth/slack
```

---

## ⚙️ Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
# Server Configuration
PORT=3000

# Slack App Credentials (Get these from https://api.slack.com/apps)
SLACK_CLIENT_ID=your_slack_client_id_here
SLACK_CLIENT_SECRET=your_slack_client_secret_here
SLACK_SIGNING_SECRET=your_slack_signing_secret_here

# OAuth Redirect URL (Must match your deployment URL)
SLACK_REDIRECT_URL=https://your-domain.com/auth/slack/callback
```

### 🔍 Where to Find Your Slack Credentials

1. Visit [Slack API Dashboard](https://api.slack.com/apps)
2. Select your app (or create a new one)
3. Navigate to **"Basic Information"**:
   - Copy **Client ID** → `SLACK_CLIENT_ID`
   - Copy **Client Secret** → `SLACK_CLIENT_SECRET`
   - Copy **Signing Secret** → `SLACK_SIGNING_SECRET`

---

## 🛠️ Installation & Setup

Choose your preferred deployment method:

### Method 1: Replit Deployment

Perfect for quick testing and prototyping without local setup.

#### Step 1: Replit Project Setup

1. **Create New Repl**:
   - Go to [Replit](https://replit.com)
   - Click "Create Repl" → "Import from GitHub"
   - Paste your repository URL

2. **Configure Dependencies**:
   ```json
   {
     "dependencies": {
       "express": "^4.18.2",
       "http-proxy-middleware": "^2.0.6",
       "dotenv": "^16.0.3"
     }
   }
   ```

3. **Install Packages**:
   ```bash
   npm install
   ```

#### Step 2: Environment Configuration

In Replit's **Secrets** tab (🔒 icon), add:

```env
SLACK_CLIENT_ID=your_actual_client_id
SLACK_CLIENT_SECRET=your_actual_client_secret  
SLACK_SIGNING_SECRET=your_actual_signing_secret
SLACK_REDIRECT_URL=https://your-repl-name.your-username.repl.co/auth/slack/callback
```

#### Step 3: Slack App Configuration

1. Go to [Slack API Dashboard](https://api.slack.com/apps) → Your App
2. Navigate to **"OAuth & Permissions"**
3. Under **"Redirect URLs"**, add:
   ```
   https://your-repl-name.your-username.repl.co/auth/slack/callback
   ```
4. Under **"Bot Token Scopes"**, add these permissions:
   ```
   chat:write
   chat:write.public
   channels:history
   channels:read
   im:read
   im:write
   app_mentions:read
   channels:join
   ```

#### Step 4: Deploy and Test

1. **Start Proxy Server**:
   - Click **"Run"** in Replit (runs server.js on port 7000)
   - Note the generated URL: `https://your-repl-name.your-username.repl.co`

2. **Start Main Backend**:
   - Open Replit **Console** tab
   - Run: `node index.js`

3. **Authorize Your App**:
   - Visit: `https://your-repl-name.your-username.repl.co/auth/slack`
   - Click **"Allow"** to authorize your Slack app

🎉 **You're ready to start making API calls!**

---

### Method 2: Local Development with ngrok

Ideal for development with full local control and debugging capabilities.

#### Step 1: Project Setup

```bash
# Clone and setup
git clone https://github.com/your-username/Slack-Messaging-Sandbox.git
cd Slack-Messaging-Sandbox
npm install

# Install ngrok globally (if not already installed)
npm install -g ngrok
```

#### Step 2: Environment Configuration

Create `.env` file:
```env
PORT=3000
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
SLACK_SIGNING_SECRET=your_slack_signing_secret
SLACK_REDIRECT_URL=https://your-ngrok-url.ngrok.io/auth/slack/callback
```

#### Step 3: Start Services

**Terminal 1 - Proxy Server**:
```bash
node server.js
```

**Terminal 2 - ngrok Tunnel**:
```bash
ngrok http 7000
```
Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

**Terminal 3 - Main Backend**:
```bash
node index.js
```

#### Step 4: Configure Slack App

1. Update your `.env` with the ngrok URL:
   ```env
   SLACK_REDIRECT_URL=https://abc123.ngrok.io/auth/slack/callback
   ```

2. In Slack API Dashboard → OAuth & Permissions → Redirect URLs:
   ```
   https://abc123.ngrok.io/auth/slack/callback
   ```

#### Step 5: Test Authorization

Visit: `https://abc123.ngrok.io/auth/slack`

---

## 🔌 API Endpoints

### Authentication Endpoints

#### `GET /auth/slack`
Initiates Slack OAuth flow by redirecting to Slack's authorization page.

**Usage**:
```bash
curl https://your-domain.com/auth/slack
```

#### `GET /auth/slack/callback`
Handles OAuth callback from Slack and exchanges authorization code for Bot Token.

**Parameters**:
- `code` (query): Authorization code from Slack
- `state` (query, optional): CSRF protection state

---

### Message Management Endpoints

#### `POST /message/send`
Send a message to a channel or user.

**Request Body**:
```json
{
  "channel": "C1234567890",  // Channel ID
  "text": "Hello, World! 👋"
}
```

**Or send to user**:
```json
{
  "user": "U1234567890",     // User ID  
  "text": "Private message!"
}
```

**Response**:
```json
{
  "ok": true,
  "channel": "C1234567890",
  "ts": "1234567890.123456",
  "message": {
    "text": "Hello, World! 👋",
    "user": "U0BOTUSER",
    "ts": "1234567890.123456"
  }
}
```

**cURL Example**:
```bash
curl -X POST https://your-domain.com/message/send \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C1234567890",
    "text": "Hello from Slack Bot! 🤖"
  }'
```

---

#### `POST /message/schedule`
Schedule a message for future delivery.

**Request Body**:
```json
{
  "channel": "C1234567890",
  "text": "This is a scheduled message! ⏰",
  "post_at": 1748735100
}
```

**Response**:
```json
{
  "ok": true,
  "scheduled_message_id": "Q1234567890",
  "post_at": 1748735100,
  "channel": "C1234567890"
}
```

**Unix Timestamp Helper**:
```javascript
// Schedule for 1 hour from now
const oneHourLater = Math.floor(Date.now() / 1000) + 3600;
```

---

#### `GET /message/get`
Retrieve message history from a channel.

**Query Parameters**:
- `channel` (required): Channel ID
- `oldest` (optional): Start timestamp (Unix timestamp with decimals)
- `latest` (optional): End timestamp (Unix timestamp with decimals)
- `limit` (optional): Number of messages to return (default: 100)

**Example**:
```bash
curl "https://your-domain.com/message/get?channel=C1234567890&limit=10"
```

**Response**:
```json
{
  "ok": true,
  "messages": [
    {
      "type": "message",
      "user": "U1234567890",
      "text": "Hello there!",
      "ts": "1234567890.123456"
    }
  ],
  "has_more": false
}
```

---

#### `POST /message/edit`
Update an existing message.

**Request Body**:
```json
{
  "channel": "C1234567890",
  "ts": "1234567890.123456",
  "text": "Updated message content! ✏️"
}
```

**Response**:
```json
{
  "ok": true,
  "channel": "C1234567890",
  "ts": "1234567890.123456",
  "text": "Updated message content! ✏️"
}
```

---

#### `POST /message/delete`
Delete a message from a channel.

**Request Body**:
```json
{
  "channel": "C1234567890",
  "ts": "1234567890.123456"
}
```

**Response**:
```json
{
  "ok": true,
  "channel": "C1234567890",
  "ts": "1234567890.123456"
}
```

---

## 📁 Project Structure

```
Slack-Messaging-Sandbox/
├── 📄 .env                          # Environment variables
├── 📄 .gitignore                    # Git ignore patterns
├── 📄 README.md                     # This documentation
├── 📄 package.json                  # Node.js dependencies
├── 📄 server.js                     # Proxy server (Port 7000)
├── 📄 index.js                      # Main Express app (Port 3000)
│
├── 📁 proxy/
│   └── 📄 server.js                 # Alternative proxy location
│
├── 📁 routes/
│   ├── 📄 auth.js                   # OAuth routes (/auth/*)
│   └── 📄 messages.js               # Message routes (/message/*)
│
├── 📁 controllers/
│   ├── 📄 authController.js         # OAuth request handling
│   └── 📄 messageController.js      # Message request validation
│
└── 📁 services/
    └── 📄 slackService.js           # Slack API integration & token management
```

### 📋 File Descriptions

**Core Application Files**:
- `index.js` - Main Express server with route mounting and middleware
- `server.js` - HTTP proxy for public URL exposure and OAuth callbacks

**Route Handlers**:
- `routes/auth.js` - Handles `/auth/slack` and `/auth/slack/callback` endpoints
- `routes/messages.js` - Manages all message-related API endpoints

**Business Logic**:
- `controllers/authController.js` - Validates OAuth requests and manages authentication flow
- `controllers/messageController.js` - Validates message requests and handles errors
- `services/slackService.js` - Direct Slack Web API communication and Bot Token management

---

## 🔧 Advanced Configuration

### Custom Proxy Settings

Modify `server.js` to customize proxy behavior:

```javascript
// Remove /proxy prefix requirement
app.use(
  "/",
  createProxyMiddleware({
    target: "http://127.0.0.1:3000",
    changeOrigin: true,
    // Remove pathRewrite to disable prefix stripping
  })
);
```

### Environment-Specific Configuration

**Development**:
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

**Production**:
```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

### Adding Custom Middleware

In `index.js`, add middleware before routes:

```javascript
// Custom logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Rate limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 🔴 "Invalid Client ID" Error
**Problem**: Slack returns invalid client ID error during OAuth.
**Solution**: 
- Verify `SLACK_CLIENT_ID` in your environment variables
- Check that your Slack app is created and published
- Ensure you're using the correct Client ID from Slack API dashboard

#### 🔴 "Redirect URL Mismatch" Error  
**Problem**: OAuth callback fails with URL mismatch.
**Solution**:
- Ensure `SLACK_REDIRECT_URL` exactly matches the URL in Slack app settings
- Check for trailing slashes, HTTP vs HTTPS
- Verify your proxy is running and accessible

#### 🔴 "Missing Scopes" Error
**Problem**: API calls fail due to insufficient permissions.
**Solution**:
- Add required scopes in Slack App → OAuth & Permissions → Bot Token Scopes
- Reinstall your app to workspace after adding scopes
- Required scopes: `chat:write`, `channels:read`, `im:write`

#### 🔴 Proxy Server Not Accessible
**Problem**: Can't reach your application through public URL.
**Solution**:
- **Replit**: Ensure server.js is running (click Run button)
- **ngrok**: Check that ngrok is running on correct port (7000)
- **Firewall**: Verify no firewall blocking the proxy port

#### 🔴 "Channel Not Found" Error
**Problem**: Can't send messages to specific channels.
**Solution**:
- Ensure your bot is added to the target channel
- Use channel ID (C1234567890) instead of channel name
- Check that channel exists and is accessible

### Debug Mode

Enable detailed logging by setting environment variable:
```env
DEBUG=slack-sandbox:*
```

Or add console logging in `services/slackService.js`:
```javascript
console.log('API Request:', { method, url, data });
console.log('API Response:', response.data);
```

### Testing Your Setup

Use these test commands to verify functionality:

```bash
# Test OAuth initiation
curl https://your-domain.com/auth/slack

# Test message sending (after OAuth)
curl -X POST https://your-domain.com/message/send \
  -H "Content-Type: application/json" \
  -d '{"channel":"C1234567890","text":"Test message"}'

# Test message retrieval
curl "https://your-domain.com/message/get?channel=C1234567890&limit=1"
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🔄 Development Workflow

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** with clear, commented code
4. **Add tests** for new functionality
5. **Commit with conventional format**:
   ```bash
   git commit -m "feat: add message scheduling functionality"
   ```
6. **Push and create Pull Request**

### 📝 Commit Message Convention

- `feat:` New features
- `fix:` Bug fixes  
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### 🧪 Running Tests

```bash
# Install test dependencies
npm install --dev

# Run test suite
npm test

# Run with coverage
npm run test:coverage
```

### 📋 Pull Request Guidelines

- Provide clear description of what your PR does
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused and atomic



## 🙏 Acknowledgments

- **Slack Team** for the comprehensive Web API
- **Express.js Community** for the robust web framework
- **Node.js Contributors** for the runtime environment
- **Open Source Community** for inspiration and best practices

---

## 📞 Support & Community

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Poojan157/Slack-Messaging-Sandbox/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Poojan157/Slack-Messaging-Sandbox/discussions)
- 📚 **Documentation**: [Wiki](https://github.com/Poojan157/Slack-Messaging-Sandbox/wiki)
- 💬 **Community Chat**: [Slack Workspace](https://join.slack.com/your-workspace)

---

<div align="center">

**Made with ❤️ by developers, for developers**

⭐ **If this project helped you, please consider giving it a star!** ⭐

</div>
