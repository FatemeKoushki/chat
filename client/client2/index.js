const { io } = require("socket.io-client");

const socket = io("http://localhost:3001");

console.log("Client started...");

socket.on("connect", () => {

socket.emit("user:join", {
    userId: "ali1233",
    name: "ali",
  });
  
});

socket.on("private-message", (data) => {
  console.log("New message:", data);
});
socket.on("connect_error", (error) => {
  console.log("Connection error:", error.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected!");
});