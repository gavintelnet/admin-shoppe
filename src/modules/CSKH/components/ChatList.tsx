import React, { useContext } from "react";
import { ChatContext } from "../../../context/ChatContext";
import { useFetchLatestMessage } from "../../../hooks/useFetchLatestMessage";
import { useFetchRecipientUser } from "../../../hooks/useFetchRecipient";
import { unreadNotificationFunc } from "../../../utils/unreadNotifications";
import avt from "../../../assets/images/6596121.png";
import { FiClock, FiMessageSquare } from "react-icons/fi";
import DateTimeComponent from "../../../utils/DateTimeComponent";

interface Member {
  _id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
}

const ChatList: React.FC<any> = ({
  chat,
  onSelectChat,
  selectedUser,
  setSelectedUser,
  onlineUsers,
}) => {
  const { notifications, markThisUserNotificationsAsRead, setIsChatOpen } =
    useContext(ChatContext);

  const { latestMessage } = useFetchLatestMessage(chat);
  const { recipientUser } = useFetchRecipientUser(
    chat,
    "666bbbbe3e77ff36ae8f7f68"
  );

  const unreadNotifications = unreadNotificationFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter(
    (n: any) => n.senderId === recipientUser?._id
  );
  if (!recipientUser) {
    // Không hiển thị tài khoản bị xóa hoặc gặp lỗi
    return null;
  }

  const handleUserItemClick = () => {
    if (thisUserNotifications?.length !== 0) {
      markThisUserNotificationsAsRead(thisUserNotifications, notifications);
    }
    setSelectedUser(recipientUser?.username);
    setIsChatOpen(false); // Mark chat as closed when user item is clicked
  };

  return (
    <div className="chat-list">
      <div
        className={`chat-item ${
          selectedUser === recipientUser._id ? "selected" : ""
        }`}
        onClick={handleUserItemClick}
      >
        <img src={avt} alt={recipientUser?.username} className="avatar" />
        <div className="chat-info">
          <div className="chat-name">{recipientUser?.username}</div>
          {thisUserNotifications?.length > 0 ? (
            <div className="last-message">
              <FiMessageSquare size={10} /> Tin nhắn mới
            </div>
          ) : null}
        </div>
        <div className="chat-right">
          <div className="online-status">
            <span
              className={`online-dot ${
                onlineUsers?.some(
                  (user: any) => user?.userId === recipientUser?._id
                )
                  ? "online"
                  : "offline"
              }`}
            />
          </div>
          <div className="chat-time">
            <FiClock size={12} />{" "}
            <DateTimeComponent dateString={latestMessage?.createdAt} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
