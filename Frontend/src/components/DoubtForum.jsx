import React, { useState, useEffect } from "react";
import "./DoubtForum.css";

const DoubtForum = ({ reset, question }) => {
  const [doubt, setDoubt] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (reset) {
      setChat([]); // Clear chat history when reset is true
    }
  }, [reset]);

  const handleDoubtSubmit = async () => {
    if (!doubt.trim()) return;

    const newChat = [...chat, { sender: "user", message: doubt }];
    setChat(newChat);
    setDoubt("");
    setIsTyping(true); // Show typing animation

    try {
      console.log({question});
      const response = await fetch("http://localhost:4000/interview/doubt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, doubt, prevChat: chat }),
      });

      const data = await response.json();
      console.log({doubtResponse: data});
      setIsTyping(false); // Hide typing animation
      setChat([...newChat, { sender: "assistant", message: data.message }]);
    } catch (error) {
      setIsTyping(false); // Hide typing animation
      console.error("Error fetching response:", error);
      setChat([
        ...newChat,
        { sender: "assistant", message: "Error fetching response" },
      ]);
    }
  };

  return (
    <div className="doubtforum-container">
      <div className="doubtforum-header">Have a Doubt?</div>
      <div className="input-container">
        <input
          className="doubt-input"
          value={doubt}
          onChange={(e) => setDoubt(e.target.value)}
          placeholder="Type your doubt here..."
        />
        <button className="submit-doubt" onClick={handleDoubtSubmit}>
          Ask
        </button>
      </div>
      <div className="chat-window">
        {chat.map((chatItem, index) => (
          <div
            key={index}
            className={`chat-bubble ${chatItem.sender === "user" ? "user-message" : "assistant-message"
              }`}
          >
            {chatItem.message}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble assistant-message typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoubtForum;
