import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import "./style.scss";
import { useLocation } from "react-router-dom";
import { getUserInfo } from "../../utils/auth";
import chatService from "../../services/chatService";
import userService from "../../services/userService";

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

        let updatedListUsers = [...data];

        if (userId && !data.some((user) => user.id === userId)) {
          try {
            const userInfo = await userService.getUserById(userId);
            updatedListUsers.unshift(userInfo.resultObj);
          } catch (error) {
            throw error;
          }
        }

        setListUsers(updatedListUsers);
      } catch (error) {
        throw error;
      }
    };
    fetchUsers();
  }, [userId]);

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

  // Helper function để format thời gian
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Helper function để format ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Kiểm tra nếu là hôm nay
    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    }
    
    // Kiểm tra nếu là hôm qua
    if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    }

    // Trả về ngày tháng năm
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper function để nhóm tin nhắn theo ngày
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach((message) => {
      const date = new Date(message.sendAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };

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
        // Nếu không có tin nhắn nào (cuộc trò chuyện mới), set messages rỗng
        setMessages([]);
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
      const response = await chatService.sendMessage(
        currentUserId,
        recipientUserId,
        message
      );

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

      // Sau khi gửi tin nhắn đầu tiên thành công, refresh lại danh sách users
      // để đảm bảo cuộc trò chuyện mới được lưu vào danh sách và cập nhật thông tin user
      if (messages.length === 0) {
        setTimeout(async () => {
          try {
            const updatedUsers = await chatService.getParners(getUserInfo().id);
            setListUsers((prevUsers) => {
              // Giữ lại user tạm thời nếu không có trong danh sách mới
              const tempUser = prevUsers.find(
                (u) => u.id === recipientUserId && u.isTemporary
              );
              if (
                tempUser &&
                !updatedUsers.some((u) => u.id === recipientUserId)
              ) {
                return [tempUser, ...updatedUsers];
              }
              return updatedUsers;
            });
          } catch (error) {
            console.error("Lỗi khi refresh danh sách users:", error);
          }
        }, 1000); // Delay 1s để đảm bảo backend đã lưu
      }
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };

  const handleSelectUser = (userId) => {
    setRecipientUserId(userId);
    setMessages([]); // Reset messages khi chọn user mới

    // Reset channelName để tạo lại cho cuộc trò chuyện mới
    const newChannelName =
      currentUserId < userId
        ? `chat-${currentUserId}-${userId}`
        : `chat-${userId}-${currentUserId}`;
    setChannelName(newChannelName);
  };

  // Tìm thông tin user được chọn
  const selectedUser = listUsers.find((user) => user.id === recipientUserId);

  // Nhóm tin nhắn theo ngày
  const groupedMessages = groupMessagesByDate(messages);

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
              <span className="user-name">
                {user.fullName}
                {user.isTemporary && <span className="loading-dots">...</span>}
              </span>
              {/* Hiển thị indicator cho cuộc trò chuyện mới */}
              {user.id === userId && messages.length === 0 && (
                <span className="new-conversation-badge">Mới</span>
              )}
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
                {/* Hiển thị trạng thái cuộc trò chuyện mới */}
                {messages.length === 0 && (
                  <span className="new-conversation-status">
                    Cuộc trò chuyện mới
                  </span>
                )}
              </div>
            </div>

            {/* Khu vực tin nhắn */}
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="no-messages-placeholder">
                  <div className="placeholder-content">
                    <h4>Chưa có tin nhắn nào</h4>
                    <p>Hãy gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện!</p>
                  </div>
                </div>
              ) : (
                groupedMessages.map((group, groupIndex) => (
                  <div key={group.date} className="message-group">
                    {/* Header ngày */}
                    <div className="date-separator">
                      <span className="date-label">
                        {formatDate(group.messages[0].sendAt)}
                      </span>
                    </div>
                    
                    {/* Tin nhắn trong ngày */}
                    {group.messages.map((msg, index) => (
                      <div
                        key={`${groupIndex}-${index}`}
                        className={`message-container ${
                          msg.senderId.id === currentUserId
                            ? "user-message"
                            : "other-message"
                        }`}
                      >
                        <div className="message-content">
                          <div className="message-bubble">{msg.message}</div>
                          <div className="message-time">
                            {formatTime(msg.sendAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Form gửi tin nhắn */}
            <div className="chat-footer">
              <form onSubmit={handleSendMessage} className="message-form">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    messages.length === 0
                      ? "Gửi tin nhắn đầu tiên..."
                      : "Nhập tin nhắn..."
                  }
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
              <p>
                Hãy chọn một người từ danh sách bên trái để bắt đầu trò chuyện
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;