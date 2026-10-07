"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  console.log("messages :" ,messages)

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      socket.emit("user:join", {
        userId: "sara",
        name: "sara",
      });
    });

    socket.on("private-message", (data) => {
      console.log("🔥 RECEIVED:", data);

      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("private-message");
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current?.emit("private-message", {
      to: "ali1233",
      message,
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col justify-center items-center mt-18">
      <h1>sara Chat</h1>

       <div className="w-full max-w-md border rounded-lg p-4">
  {messages.map((item, index) => (
  <div
    key={index}
    className={`mb-3 flex ${
      item.from === "sara"
        ? "justify-end"
        : "justify-start"
    }`}
  >
    <div
      className={`rounded-lg p-3 ${
        item.from === "sara"
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-black"
      }`}
    >
      <p className="text-xs">
        {item.from}
      </p>

      <p>
        {item.message}
      </p>
    </div>
  </div>
))}
</div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="پیام خود را بنویسید..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}