import React, { useState, useRef, useEffect } from "react";
import "./ChatWidget.scss";
import aIWebsiteService from "../../services/aIWebsiteService";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Xin chào! Tôi là trợ lý AI, bạn cần hỗ trợ gì?", fromAI: true },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { text: question, fromAI: false }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await aIWebsiteService.getResponse(question);

      if (res?.isSuccessed && res.message) {
        setMessages((prev) => [...prev, { text: res.message, fromAI: true }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Xin lỗi, tôi chưa thể xử lý yêu cầu này.", fromAI: true },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Đã xảy ra lỗi khi kết nối đến AI. Vui lòng thử lại sau.",
          fromAI: true,
        },
      ]);
      console.error("Lỗi AI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 0);
    }
  }, [isOpen]);

  return (
    <div className="chatbot-wrapper">
      {isOpen ? (
        <div className="chat-window">
          <div className="chat-ai-header">
            <span className="chat-title">Trợ lý AI - TeamUp</span>
            <button className="close-button" onClick={toggleChat}>
              ✕
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${
                  msg.fromAI ? "from-ai" : "from-user"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble from-ai">
                <p>Đang trả lời...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading}>
              Gửi
            </button>
          </div>
        </div>
      ) : (
        <button className="chat-toggle-button" onClick={toggleChat}>
          💬
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
