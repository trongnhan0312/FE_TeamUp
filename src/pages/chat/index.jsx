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
  const role = location?.state?.role;
  const [recipientUserId, setRecipientUserId] = useState(userId);
  const currentUserId = getUserInfo().id;
  const [listUsers, setListUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await chatService.getPartners(getUserInfo().id);

        let updatedListUsers = [...data];

        // CHỈ thêm user mới nếu userId tồn tại VÀ không có trong danh sách partners
        if (userId && !data.some((user) => user.id ===  parseInt(userId))) {
          try {
            const userInfo = await userService.getUserByRole(userId, role);

            const normalizedUser = {
              id: userInfo.resultObj.id,
              fullName: userInfo.resultObj.fullName,
              avatarUrl: userInfo.resultObj.avatarUrl,
              email: userInfo.resultObj.email,
              isTemporary: true,
            };

            updatedListUsers.unshift(normalizedUser);
          } catch (error) {
            console.error("Lỗi khi lấy thông tin user:", error);
          }
        }

        setListUsers(updatedListUsers);

        // Nếu userId được truyền vào và đã có trong danh sách, set làm recipient
        if (userId) {
          const existingUser = updatedListUsers.find(user => user.id === userId);
          if (existingUser) {
            setRecipientUserId(userId);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách partners:", error);
      }
    };
    fetchUsers();
  }, [userId, role]);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [pusherInstance, setPusherInstance] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);

  // Helper function để format thời gian
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
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
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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
      messages,
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

  // Helper function để tạo channel name chuẩn
  const generateChannelName = (userId1, userId2) => {
    if (!userId1 || !userId2) return null;
    return userId1 < userId2
      ? `chat-${userId1}-${userId2}`
      : `chat-${userId2}-${userId1}`;
  };

  // Lấy tin nhắn lịch sử
  useEffect(() => {
    if (!recipientUserId) return;

    const fetchMessages = async () => {
      try {
        const data = await chatService.getMessage(
          currentUserId,
          recipientUserId
        );
        setMessages(data || []); // Đảm bảo luôn có array
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

    console.log("Subscribing to channel:", channelNameToSubscribe);

    // Unsubscribe từ channel cũ nếu có
    if (currentChannel) {
      console.log("Unsubscribing from old channel:", currentChannel.name);
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

  // Subscribe khi có recipientUserId
  useEffect(() => {
    if (!recipientUserId || !pusherInstance) return;

    const channelNameToSubscribe = generateChannelName(
      currentUserId,
      recipientUserId
    );
    if (channelNameToSubscribe) {
      subscribeToChannel(channelNameToSubscribe);
    }

    return () => {
      if (currentChannel) {
        currentChannel.unbind_all();
        if (pusherInstance) {
          pusherInstance.unsubscribe(currentChannel.name);
        }
      }
    };
  }, [recipientUserId, pusherInstance]);

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

      // Kiểm tra nếu server trả về channelName khác với channelName hiện tại
      const expectedChannelName = generateChannelName(
        currentUserId,
        recipientUserId
      );
      const serverChannelName = response.channelName;

      if (serverChannelName && serverChannelName !== expectedChannelName) {
        console.log(
          "Server returned different channel name:",
          serverChannelName
        );
        console.log("Expected channel name:", expectedChannelName);

        // Subscribe to channel name từ server
        subscribeToChannel(serverChannelName);
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

      // Chỉ refresh danh sách users nếu đây là tin nhắn đầu tiên với user tạm thời
      const isTemporaryUser = listUsers.find(
        user => user.id === recipientUserId && user.isTemporary
      );
      
      if (isTemporaryUser && messages.length === 0) {
        setTimeout(async () => {
          try {
            const updatedUsers = await chatService.getPartners(getUserInfo().id);
            setListUsers(updatedUsers);
          } catch (error) {
            console.error("Lỗi khi refresh danh sách users:", error);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };

  const handleSelectUser = (userId) => {
    console.log("Selecting user:", userId);
    setRecipientUserId(userId);
    // KHÔNG reset messages ở đây - để useEffect xử lý việc load messages
  };

  useEffect(() => {
    setSelectedUser(listUsers?.find((user) => user.id === recipientUserId));
  }, [listUsers, recipientUserId]);

  // Nhóm tin nhắn theo ngày
  const groupedMessages = groupMessagesByDate(messages);

  // Kiểm tra xem có phải cuộc trò chuyện mới không
  const isNewConversation = messages.length === 0 && recipientUserId;
  const isTemporaryUser = selectedUser?.isTemporary;

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
              {/* Chỉ hiển thị badge "Mới" cho user tạm thời và chưa có tin nhắn */}
              {user.isTemporary && user.id === recipientUserId && isNewConversation && (
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
                {/* Chỉ hiển thị trạng thái mới cho user tạm thời */}
                {isNewConversation && isTemporaryUser && (
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
                    <h4>
                      {isTemporaryUser ? "Cuộc trò chuyện mới" : "Chưa có tin nhắn nào"}
                    </h4>
                    <p>Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện!</p>
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
                    isNewConversation
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