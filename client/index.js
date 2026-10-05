const { io } = require("socket.io-client");

const socket = io("http://localhost:3001");

console.log("Client started...");

socket.on("connect", () => {
  console.log("Connected:", socket.id);
socket.emit("user:join", {
    userId: "fateme",
    name: "Fateme",
  });
  socket.emit("private-message", {
    to: "ali1233",
    message: "سلام علی 👋",
  });
});





socket.on("connect_error", (error) => {
  console.log("Connection error:", error.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected!");
});