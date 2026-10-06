"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function AliChat() {
  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Ali connected:", socket.id);

      socket.emit("user:join", {
        userId: "ali1233",
        name: "Ali",
      });
    });

    socket.on("private-message", (data) => {
      console.log("🔥 Ali received:", data);

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
      to: "fateme",
      message,
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col items-center mt-18">
      <h1>Ali Chat</h1>

<div className="w-full max-w-md border rounded-lg p-4">
  {messages.map((item, index) => (
    <div
      key={index}
      className={`mb-3 flex ${
        item.from === "ali1233"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          item.from === "ali1233"
            ? "bg-blue-500 text-white"
            : " bg-gray-200 text-black"
        }`}
      >
        <p className="text-xs font-bold">
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

      <button onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}
