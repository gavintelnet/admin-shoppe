// import React, { useContext, useEffect, useState, useRef } from "react";
// import { FiSearch } from "react-icons/fi";
// import ChatList from "./components/ChatList";
// import { ChatContext } from "../../context/ChatContext";
// import ChatBox from "./components/ChatBox";
// import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
// type Props = {};

// const Cskh: React.FC<Props> = () => {
//   const [selectedUser, setSelectedUser] = useState<string | null>(null);
//   const [sortedChats, setSortedChats] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>(""); // State để lưu từ khóa tìm kiếm
//   const prevUserChatsRef = useRef<any>([]);
//   const {
//     userChats,
//     isUserChatsLoading,
//     updateCurrentChat,
//     currentChat,
//     onlineUsers,
//     notifications,
//   } = useContext(ChatContext);

//   const { recipientUser } = useFetchRecipientUser(
//     currentChat,
//     "666bbbbe3e77ff36ae8f7f68"
//   );
//   // Hàm sắp xếp danh sách `userChats` dựa trên thời gian tin nhắn cuối cùng hoặc thông báo chưa đọc
//   const sortChats = (chats: any[]) => {
//     return [...chats].sort((a: any, b: any) => {
//       const aLastMessageDate = new Date(a.lastMessageTime).getTime();
//       const bLastMessageDate = new Date(b.lastMessageTime).getTime();

//       // Kiểm tra xem có thông báo chưa đọc không
//       const aHasUnreadNotification = notifications.some(
//         (n: any) => n.chatId === a._id && !n.isRead
//       );
//       const bHasUnreadNotification = notifications.some(
//         (n: any) => n.chatId === b._id && !n.isRead
//       );

//       // Ưu tiên các chat có thông báo chưa đọc lên đầu
//       if (aHasUnreadNotification && !bHasUnreadNotification) return -1;
//       if (!aHasUnreadNotification && bHasUnreadNotification) return 1;

//       // Nếu cả hai đều có hoặc không có thông báo, sắp xếp theo thời gian tin nhắn cuối cùng
//       return bLastMessageDate - aLastMessageDate;
//     });
//   };

//   // Cập nhật `sortedChats` khi `userChats` hoặc `notifications` thay đổi
//   useEffect(() => {
//     if (prevUserChatsRef.current !== userChats) {
//       setSortedChats(sortChats(userChats || []));
//       prevUserChatsRef.current = userChats;
//     }
//   }, [userChats, notifications]);

//   // Lọc danh sách chats dựa trên từ khóa tìm kiếm
//   useEffect(() => {
//     if (searchTerm) {
//       const filteredChats = sortChats(userChats || []).filter((chat) =>
//         chat.members.some((member) =>
//           member.username.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//       setSortedChats(filteredChats);
//     } else {
//       setSortedChats(sortChats(userChats || []));
//     }
//   }, [searchTerm, userChats, notifications]);

//   const handleChatClick = (chat: any) => {
//     // Giữ nguyên vị trí khi xem tin nhắn
//     updateCurrentChat(chat);
//     setSelectedUser(chat._id);
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-sidebar">
//         <div className="search-bar">
//           <FiSearch />
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm khi nhập
//           />
//         </div>
//         {isUserChatsLoading && <p>Loading......</p>}
//         {sortedChats.length === 0 ? (
//           <p>No chats available</p>
//         ) : (
//           <div>
//             {sortedChats.map((chat, index) => (
//               <div key={index} onClick={() => handleChatClick(chat)}>
//                 <ChatList
//                   chat={chat}
//                   onSelectChat={setSelectedUser}
//                   selectedUser={selectedUser}
//                   setSelectedUser={setSelectedUser}
//                   onlineUsers={onlineUsers}
//                 />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <ChatBox
//         selectedUser={selectedUser}
//         onlineUsers={onlineUsers}
//         recipientUser={recipientUser}
//       />
//     </div>
//   );
// };

// export default Cskh;

import React, { useContext, useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";
import ChatList from "./components/ChatList";
import { ChatContext } from "../../context/ChatContext";
import ChatBox from "./components/ChatBox";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient"; // Thay đổi path phù hợp với dự án của bạn
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";

type Props = {};

const Cskh: React.FC<Props> = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [sortedChats, setSortedChats] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State để lưu từ khóa tìm kiếm
  const prevUserChatsRef = useRef<any>([]);
  const dispatch = useDispatch();
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

  // Cập nhật `sortedChats` khi `userChats` hoặc `notifications` thay đổi
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (prevUserChatsRef.current !== userChats) {
      dispatch(startLoading());
      timeoutId = setTimeout(() => {
        const sorted = sortChats(userChats || []);
        setSortedChats(sorted);
        prevUserChatsRef.current = userChats;
        dispatch(stopLoading());
      }, 5000); // Thời gian chờ 5 giây
    }

    return () => {
      clearTimeout(timeoutId); // Dọn dẹp timeout khi component unmount hoặc khi deps thay đổi
    };
  }, [userChats, notifications, dispatch]);

  // Lọc danh sách chats dựa trên từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm) {
      const filteredChats = sortChats(userChats || []).filter((chat) =>
        chat.members.some((member) =>
          member.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setSortedChats(filteredChats);
    } else {
      setSortedChats(sortChats(userChats || []));
    }
  }, [searchTerm, userChats, notifications]);

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
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm khi nhập
          />
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
