import React, { useEffect, useRef } from "react";
import "./DoubtForum.css";

const DoubtForum = ({
  doubt,
  setDoubt,
  chat,
  setChat,
  isTyping,
  setIsTyping,
  reset,
  question,
}) => {
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (reset) {
      setChat([]); // Clear chat history when reset is true
    }
  }, [reset, setChat]);

  useEffect(() => {
    // Auto-scroll to the bottom when new messages are added
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chat]);

  const handleDoubtSubmit = async () => {
    if (!doubt.trim()) return;

    const newChat = { sender: "user", message: doubt };
    setChat((prevChat) => [...prevChat, newChat]);
    setDoubt("");
    setIsTyping(true); // Show typing animation

    try {
      const response = await fetch("http://localhost:4000/interview/doubt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, doubt, prevChat: chat }),
      });

      const data = await response.json();
      setIsTyping(false); // Hide typing animation
      setChat((prevChat) => [
        ...prevChat,
        { sender: "assistant", message: data.message },
      ]);
    } catch (error) {
      setIsTyping(false); // Hide typing animation
      console.error("Error fetching response:", error);
      setChat((prevChat) => [
        ...prevChat,
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
          disabled={isTyping} // Disable input while typing
        />
        <button
          className="submit-doubt"
          onClick={handleDoubtSubmit}
          disabled={isTyping} // Disable button while typing
        >
          {isTyping ? "Asking..." : "Ask"}
        </button>
      </div>
      <div className="chat-window" ref={chatWindowRef}>
        {chat.map((chatItem, index) => (
          <div
            key={index}
            className={`chat-bubble ${
              chatItem.sender === "user" ? "user-message" : "assistant-message"
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
