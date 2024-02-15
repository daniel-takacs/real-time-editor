/* eslint-disable no-undef */
require("dotenv").config();
const connectDB = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const path = require("path");
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

// Serve static files from the Vite-built frontend
app.use(express.static(path.join(__dirname, "../dist")));

// Handle SPA routing by redirecting all non-API requests to the index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation"));
      }
    },
  })
);
/* require('crypto').randomBytes(32, function(err, buffer) {
    var token = buffer.toString('hex');
    console.log(token);
  }); */
app.use(express.json()); // Middleware for parsing JSON bodies
// Use the authentication routes
app.use("/auth", authRoutes);
connectDB();
app.use("/register", authRoutes);
// Configure Socket.IO to allow CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS || "http://localhost:5173",
    methods: ["GET", "POST"], // Allowed HTTP methods
    allowedHeaders: ["my-custom-header"], // Allowed custom headers
    credentials: true, // Allow sending of cookies / credentials
  },
});
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("codeChange", (code) => {
    socket.broadcast.emit("codeUpdate", code);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
