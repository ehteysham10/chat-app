const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const socketHandler = require("./socket/index");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
