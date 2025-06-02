import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import "./style.scss";
import { useLocation } from "react-router-dom";
import { getUserInfo } from "../../utils/auth";
import chatService from "../../services/chatService";

const ChatPage = () => {
  const location = useLocation();
  const userId = location?.state?.userId;

  const [recipientUserId, setRecipientUserId] = useState(userId);
  const currentUserId = getUserInfo().id;
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await chatService.getParners(getUserInfo().id);
        setListUsers(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchUsers();
  }, []);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [channelName, setChannelName] = useState("");
  const [pusherInstance, setPusherInstance] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);

  // Khởi tạo Pusher instance một lần
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
      cluster: "ap1",
    });
    setPusherInstance(pusher);

    return () => {
      pusher.disconnect();
    };
  }, []);

  // Tạo channel name mặc định (backup)
  useEffect(() => {
    if (recipientUserId) {
      setChannelName(
        currentUserId < recipientUserId
          ? `chat-${currentUserId}-${recipientUserId}`
          : `chat-${recipientUserId}-${currentUserId}`
      );
    }
  }, [currentUserId, recipientUserId]);

  // Lấy tin nhắn lịch sử
  useEffect(() => {
    if (!recipientUserId) return;

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

  // Subscribe to Pusher channel
  const subscribeToChannel = (channelNameToSubscribe) => {
    if (!pusherInstance || !channelNameToSubscribe) return;

    // Unsubscribe từ channel cũ nếu có
    if (currentChannel) {
      currentChannel.unbind_all();
      pusherInstance.unsubscribe(currentChannel.name);
    }

    // Subscribe to channel mới
    const channel = pusherInstance.subscribe(channelNameToSubscribe);
    
    channel.bind("new-message", (data) => {
      console.log("Received new message:", data);
      
      // Chỉ thêm tin nhắn nếu KHÔNG phải từ người gửi hiện tại
      // hoặc nếu là tin nhắn từ người gửi khác
      if (data.senderId !== currentUserId) {
        setMessages((prev) => [
          ...prev,
          {
            senderId: { id: data.senderId },
            receiverId: { id: data.receiverId },
            message: data.messageContent,
            sendAt: new Date().toISOString(),
          },
        ]);
      }
    });

    setCurrentChannel(channel);
  };

  // Subscribe khi có channelName và recipientUserId
  useEffect(() => {
    if (channelName && recipientUserId) {
      subscribeToChannel(channelName);
    }

    return () => {
      if (currentChannel) {
        currentChannel.unbind_all();
        if (pusherInstance) {
          pusherInstance.unsubscribe(currentChannel.name);
        }
      }
    };
  }, [channelName, recipientUserId, pusherInstance]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !recipientUserId) return;

    try {
      const response = await chatService.sendMessage(currentUserId, recipientUserId, message);
      
      console.log("Send message response:", response);
      
      // Sử dụng channelName từ response nếu có
      if (response.channelName) {
        console.log("Using channelName from response:", response.channelName);
        
        // Cập nhật channelName nếu khác với channelName hiện tại
        if (response.channelName !== channelName) {
          setChannelName(response.channelName);
          // Subscribe to channel mới ngay lập tức
          subscribeToChannel(response.channelName);
        }
      }

      // Thêm tin nhắn vào danh sách ngay lập tức (optimistic update)
      const newMessage = {
        senderId: { id: currentUserId },
        receiverId: { id: recipientUserId },
        message: message,
        sendAt: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };

  const handleSelectUser = (userId) => {
    setRecipientUserId(userId);
    setMessages([]); // Reset messages khi chọn user mới
    
    // Reset channelName để tạo lại cho cuộc trò chuyện mới
    const newChannelName = currentUserId < userId
      ? `chat-${currentUserId}-${userId}`
      : `chat-${userId}-${currentUserId}`;
    setChannelName(newChannelName);
  };

  // Tìm thông tin user được chọn
  const selectedUser = listUsers.find(user => user.id === recipientUserId);

  return (
    <div className="chat-app">
      <div className="conversation-panel">
        <h4 className="panel-title">Danh sách cuộc trò chuyện</h4>
        <ul className="user-list">
          {listUsers?.map((user) => (
            <li
              key={user.id}
              className={`user-item ${
                user.id === recipientUserId ? "active" : ""
              }`}
              tabIndex={0}
              onClick={() => handleSelectUser(user.id)}
            >
              <img src={user.avatarUrl} alt="Avatar" className="user-avatar" />
              <span className="user-name">{user.fullName}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-panel">
        {recipientUserId && selectedUser ? (
          <>
            {/* Header hiển thị thông tin người được chọn */}
            <div className="chat-header">
              <div className="recipient-info">
                <img
                  src={selectedUser.avatarUrl || "/default-avatar.png"}
                  alt="Avatar"
                  className="recipient-avatar"
                />
                <span className="recipient-name">{selectedUser.fullName}</span>
              </div>
              {/* Debug info - có thể xóa trong production */}
              <div className="debug-info" style={{ fontSize: '12px', color: '#666' }}>
                Channel: {channelName}
              </div>
            </div>

            {/* Khu vực tin nhắn */}
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
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Form gửi tin nhắn */}
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
          </>
        ) : (
          // Hiển thị thông báo khi chưa chọn người dùng
          <div className="no-chat-selected">
            <div className="no-chat-message">
              <h3>Chọn một cuộc trò chuyện</h3>
              <p>Hãy chọn một người từ danh sách bên trái để bắt đầu trò chuyện</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;