import React, { useContext, useEffect, useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import ChatList from "./components/ChatList";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import ChatBox from "./components/ChatBox";

type Props = {};

const Cskh: React.FC<Props> = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [sortedChats, setSortedChats] = useState<any[]>([]);
  const prevUserChatsRef = useRef<any>([]);
  const {
    userChats,
    isUserChatsLoading,
    updateCurrentChat,
    currentChat,
    onlineUsers,
    notifications,
  } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(
    currentChat,
    "666bbbbe3e77ff36ae8f7f68"
  );

  // Hàm sắp xếp danh sách `userChats` dựa trên thời gian tin nhắn cuối cùng hoặc thông báo chưa đọc
  const sortChats = (chats: any[]) => {
    return [...chats].sort((a: any, b: any) => {
      const aLastMessageDate = new Date(a.lastMessageTime).getTime();
      const bLastMessageDate = new Date(b.lastMessageTime).getTime();

      // Kiểm tra xem có thông báo chưa đọc không
      const aHasUnreadNotification = notifications.some(
        (n: any) => n.chatId === a._id && !n.isRead
      );
      const bHasUnreadNotification = notifications.some(
        (n: any) => n.chatId === b._id && !n.isRead
      );

      // Ưu tiên các chat có thông báo chưa đọc lên đầu
      if (aHasUnreadNotification && !bHasUnreadNotification) return -1;
      if (!aHasUnreadNotification && bHasUnreadNotification) return 1;

      // Nếu cả hai đều có hoặc không có thông báo, sắp xếp theo thời gian tin nhắn cuối cùng
      return bLastMessageDate - aLastMessageDate;
    });
  };

  useEffect(() => {
    // Chỉ sắp xếp lại khi danh sách chat thay đổi
    if (prevUserChatsRef.current !== userChats) {
      setSortedChats(sortChats(userChats || []));
      prevUserChatsRef.current = userChats;
    }
  }, [userChats, notifications]);

  const handleChatClick = (chat: any) => {
    // Giữ nguyên vị trí khi xem tin nhắn
    updateCurrentChat(chat);
    setSelectedUser(chat._id);
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="search-bar">
          <FiSearch />
          <input type="text" placeholder="Search" />
        </div>
        {isUserChatsLoading && <p>Loading......</p>}
        {sortedChats.length === 0 ? (
          <p>No chats available</p>
        ) : (
          <div>
            {sortedChats.map((chat, index) => (
              <div key={index} onClick={() => handleChatClick(chat)}>
                <ChatList
                  chat={chat}
                  onSelectChat={setSelectedUser}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  onlineUsers={onlineUsers}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <ChatBox
        selectedUser={selectedUser}
        onlineUsers={onlineUsers}
        recipientUser={recipientUser}
      />
    </div>
  );
};

export default Cskh;
