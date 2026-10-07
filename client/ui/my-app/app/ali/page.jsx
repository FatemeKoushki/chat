"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const socketRef = useRef(null);

  const currentUser = {
    userId: "ali1233",
    name: "Ali",
  };

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(`${currentUser.name} connected:`, socket.id);

      socket.emit("user:join", currentUser);
    });

    socket.on("users:online", (users) => {
      console.log("Online users:", users);

      setOnlineUsers(users);
    });

    socket.on("private-message", (data) => {
      console.log("🔥 RECEIVED:", data);

      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("users:online");
      socket.off("private-message");

      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    socketRef.current?.emit("private-message", {
      to: selectedUser.userId,
      message,
    });

    setMessage("");
  };
  const conversationMessages = messages.filter((item) => {
  if (!selectedUser) return false;

  return (
    (item.from === currentUser.userId &&
      item.to === selectedUser.userId) ||
    (item.from === selectedUser.userId &&
      item.to === currentUser.userId)
  );
});

  return (
    <div className="flex gap-6 p-6">

      {/* Users */}
      <div className="w-48 border rounded-lg p-4">
        <h2 className="mb-4 font-bold">
          Online Users
        </h2>

        {onlineUsers
          .filter(
            (user) =>
              user.userId !== currentUser.userId
          )
          .map((user) => (
            <button
              key={user.userId}
              onClick={() => setSelectedUser(user)}
              className="mb-2 block w-full rounded-lg p-2 text-left hover:bg-gray-100"
            >
              {user.name}
            </button>
          ))}
      </div>

      {/* Chat */}
      <div className="w-full max-w-md">

        <h1 className="mb-4 text-xl font-bold">
          {selectedUser
            ? `Chat with ${selectedUser.name}`
            : "Select a user"}
        </h1>

        <div className="mb-4 border rounded-lg p-4">

          {conversationMessages.map((item, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                item.from === currentUser.userId
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div
                className={`rounded-lg p-3 ${
                  item.from === currentUser.userId
                    ? "bg-gray-200 text-black"
                    : "bg-blue-500 text-white"
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

        <div className="flex gap-2">

          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="پیام خود را بنویسید..."
            className="flex-1 rounded-lg border p-2"
          />

          <button
            onClick={sendMessage}
            disabled={!selectedUser}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          >
            Send
          </button>

        </div>

      </div>
    </div>
  );
}
