const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const users = new Map();
const socketUsers = new Map();


io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

 socket.on("user:join", ({ userId, name }) => {
  users.set(userId, {
    socketId: socket.id,
    name,
  });

  socketUsers.set(socket.id, userId);
  
  const onlineUsers = Array.from(users.entries()).map(
    ([userId, user]) => ({
      userId,
      name: user.name,
    })
    
  );

  io.emit("users:online", onlineUsers);
});




socket.on("private-message", ({ to, message }) => {
  const receiver = users.get(to);

  if (!receiver) {
    return;
  }

  const senderId = socketUsers.get(socket.id);

  const messageData = {
    from: senderId,
    to,
    message,
  };
  // ارسال به گیرنده
  io.to(receiver.socketId).emit("private-message", messageData);

  // ارسال به فرستنده
  socket.emit("private-message", messageData);
});

socket.on("disconnect", () => {
  const userId = socketUsers.get(socket.id);

  if (userId) {
    users.delete(userId);
    socketUsers.delete(socket.id);
  }
});
  });







httpServer.listen(3001, () => {
  console.log("Socket.IO server running on port 3001");
});