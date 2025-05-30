import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import chatService from "../../../services/chatService";
import { getUserInfo } from "../../../utils/auth";
import { useParams } from "react-router-dom";
import "./style.scss";

const UserChatPage = () => {
  const { coachId: recipientUserId } = useParams();
  const currentUserId = getUserInfo().id;

  //   const [recipientUser, setRecipientUser] = useState(null);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const channelName =
    currentUserId < recipientUserId
      ? `chat-${currentUserId}-${recipientUserId}`
      : `chat-${recipientUserId}-${currentUserId}`;

  // Lấy thông tin người nhận
  //   useEffect(() => {
  //     const fetchUserData = async () => {
  //       try {
  //         setLoading(true);
  //         setError(null);

  //         const response = await userService.getUserById(recipientUserId);
  //         if (response.isSuccessed) {
  //           setRecipientUser(response.resultObj);
  //         } else {
  //           setError(response.message || "Không thể lấy thông tin người dùng");
  //         }
  //       } catch (err) {
  //         setError("Đã xảy ra lỗi khi tải dữ liệu");
  //         console.error(err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     if (recipientUserId) fetchUserData();
  //   }, [recipientUserId]);

  // Lấy tin nhắn lịch sử
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await chatService.getMessage(
          currentUserId,
          recipientUserId
        );
        setMessages(data);
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error);
      }
    };

    fetchMessages();
  }, [currentUserId, recipientUserId]);

  // Lắng nghe tin nhắn realtime từ Pusher
  useEffect(() => {
    const pusher = new Pusher("01567a69c62f53eeceb1", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe(channelName);

    channel.bind("new-message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          senderId: { id: data.senderId },
          receiverId: { id: data.receiverId },
          message: data.messageContent,
          sendAt: new Date().toISOString(),
        },
      ]);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [channelName]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await chatService.sendMessage(currentUserId, recipientUserId, message);
      setMessage("");
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };

  //   if (loading) return <div className="chat-loading">Đang tải...</div>;
  //   if (error) return <div className="chat-error">{error}</div>;

  return (
    <div className="chat-app">
      <div className="chat-panel">
        {/* {recipientUser && (
          <div className="chat-header">
            <div className="recipient-info">
              <img
                src={recipientUser.avatarUrl || "/default-avatar.png"}
                alt="Avatar"
              />
              <span className="recipient-name">{recipientUser.fullName}</span>
            </div>
          </div>
        )} */}

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-container ${
                msg.senderId.id === currentUserId
                  ? "user-message"
                  : "other-message"
              }`}
            >
              <div className="message-content">
                <div className="message-bubble">{msg.message}</div>
                <div className="message-time">
                  {new Date(msg.sendAt).toLocaleTimeString()}
                </div>
              </div>

              <div ref={messagesEndRef} />
            </div>
          ))}
        </div>

        <div className="chat-footer">
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="message-input"
            />
            <button
              type="submit"
              className="send-button"
              disabled={!message.trim()}
              aria-label="Gửi tin nhắn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-send"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;
