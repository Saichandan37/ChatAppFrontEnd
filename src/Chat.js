import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://chat-app-back-end-tau.vercel.app");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up event listener on unmount
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = { text: message, time: new Date().toLocaleTimeString() };
      socket.emit("message", msgData);
      setMessage(""); // Clear the input field
    }
  };

  useEffect(() => {
    // Scroll to the bottom of messages when new ones are added
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
          height: "300px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "5px 0",
              padding: "5px",
              borderRadius: "5px",
              backgroundColor: "#f1f1f1",
            }}
          >
            <div>
              <strong>Time:</strong> {msg.time}
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={messageEndRef} /> {/* Auto-scroll target */}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "8px",
          borderRadius: "5px",
          backgroundColor: "#007bff",
          color: "#fff",
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
