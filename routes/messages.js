const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

/*
  POST /message/send
  Description: Send a new message to a channel or user.
  Sample Request URL:
    https://<yourdomain>.com/message/send
  Sample Payload (JSON body):
    {
      "channel": "C08UK111C6S",
      "text": "Hi! I am a SlackMessagingBot!"
    }
    OR
    {
      "user": "U08UK111C6S",
      "text": "Hello user, sending you a DM!"
    }
*/
router.post("/send", messageController.sendMessage);




/*
  POST /message/schedule
  Description: Schedule a message for future delivery.
  Sample Request URL:
    https://<yourdomain>.com/message/schedule
  Sample Payload (JSON body):
    {
      "channel": "C08UK111C6S",
      "text": "Good morning! This is a scheduled message.",
      "post_at": 1748735100
    }
    (In this example, post_at is a Unix timestamp for 2025-06-01 05:15 AM IST)
*/
router.post("/schedule", messageController.scheduleMessage);



/*
  GET /message/get
  Description: Retrieve all messages within a specified timestamp range.
  Sample Request URL:
    https://<yourdomain>.com/message/get?channel=C08UK111C6S&oldest=1623456789.000200&latest=1623456799.000200
  Query Parameters:
    • channel (required): the channel ID to fetch messages from.
    • oldest (required): the oldest Unix timestamp (in seconds, with decimals) to include.
    • latest (required): the latest Unix timestamp (in seconds, with decimals) to include.
*/
router.get("/get", messageController.getMessages);



/*
  POST /message/edit
  Description: Edit (update) an existing message identified by its timestamp.
  Sample Request URL:
    https://<yourdomain>.com/message/edit
  Sample Payload (JSON body):
    {
      "channel": "C08UK111C6S",
      "ts": "1623456789.000200",
      "text": "This message has been edited!"
    }
*/
router.post("/edit", messageController.editMessage);



/*
  POST /message/delete
  Description: Delete a message identified by its channel and timestamp.
  Sample Request URL:
    https://<yourdomain>.com/message/delete
  Sample Payload (JSON body):
    {
      "channel": "C08UK111C6S",
      "ts": "1623456789.000200"
    }
*/
router.post("/delete", messageController.deleteMessage);

module.exports = router;
