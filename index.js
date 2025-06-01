require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth");
const messageRouter = require("./routes/messages");

const app = express();
const PORT = process.env.PORT || 3000;

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health-check or root route
app.get("/", (req, res) => {
  res.send("hello world , Route To Check if server is running !");
});

// Mount routers
app.use("/auth", authRouter);
app.use("/message", messageRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});