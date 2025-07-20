const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

const socketHandler = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token?.split(" ")[1];
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // attach decoded user
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.username);

    socket.on("privateMessage", async ({ receiver, text }) => {
      const msg = new Message({
        sender: socket.user.username,
        receiver,
        text
      });
      await msg.save();

      io.emit("newMessage", msg); // basic version - broadcasts to all
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.username);
    });
  });
};

module.exports = socketHandler;

