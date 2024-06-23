// import React, { useState } from "react";
// import { Layout, Menu, Dropdown, Avatar } from "antd";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   MenuUnfoldOutlined,
//   MenuFoldOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import logoCMS from "../../assets/images/logocms.png";
// import { routes_url } from "../../routes/routes";
// import Notification from "../../modules/CSKH/components/Notification";

// const { Header, Sider, Content, Footer } = Layout;
// const { SubMenu } = Menu;

// const MainLayout = (props: any) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const toggle = () => {
//     setCollapsed(!collapsed);
//   };

//   const userMenu = (
//     <Menu>
//       <Menu.Item key="0">
//         <span>Thông tin cá nhân</span>
//       </Menu.Item>
//       <Menu.Item
//         key="1"
//         onClick={() => {
//           window.localStorage.clear();
//           window.location.href = "/login";
//         }}
//       >
//         <span>Đăng xuất</span>
//       </Menu.Item>
//     </Menu>
//   );

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Sider
//         trigger={null}
//         collapsible
//         collapsed={collapsed}
//         collapsedWidth={0}
//         style={{ background: "#fff", overflowY: "auto", height: "100vh" }}
//       >
//         <div
//           className="logo"
//           style={{
//             margin: 20,
//           }}
//         >
//           <img src={logoCMS} alt="logo" style={{ width: "100%", height: 40 }} />
//         </div>
//         <Menu selectedKeys={[`${location.pathname}`]} mode="inline">
//           {routes_url.map((group) =>
//             group.children ? (
//               <Menu.ItemGroup key={group.key} title={group.label}>
//                 {group.children.map((item) => (
//                   <Menu.Item
//                     key={item.key}
//                     icon={item.icon}
//                     className={
//                       location.pathname === item.path
//                         ? "ant-menu-item-selected"
//                         : ""
//                     }
//                   >
//                     <Link to={item.path}>{item.label}</Link>
//                   </Menu.Item>
//                 ))}
//               </Menu.ItemGroup>
//             ) : (
//               <Menu.Item
//                 key={group.key}
//                 icon={group.icon}
//                 className={
//                   location.pathname === group.path
//                     ? "ant-menu-item-selected"
//                     : ""
//                 }
//               >
//                 <Link to={group.path}>{group.label}</Link>
//               </Menu.Item>
//             )
//           )}
//         </Menu>
//       </Sider>
//       <Layout>
//         <Header
//           style={{
//             background: "#fff",
//             padding: 0,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <div
//             style={{ display: "flex", alignItems: "center", marginLeft: 20 }}
//           >
//             {collapsed ? (
//               <MenuUnfoldOutlined
//                 style={{ fontSize: 25 }}
//                 className="trigger"
//                 onClick={toggle}
//               />
//             ) : (
//               <MenuFoldOutlined
//                 style={{ fontSize: 25 }}
//                 className="trigger"
//                 onClick={toggle}
//               />
//             )}
//             <div className="remix-logo-title" onClick={() => navigate("/")}>
//               <h2>Quản trị website</h2>
//             </div>
//           </div>
//           <div style={{ display: "flex", flexDirection: "row", gap: 40 }}>
//             <div style={{ position: "relative", top: 8 }}>
//               <Notification />
//             </div>
//             <Dropdown overlay={userMenu} trigger={["click"]}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   cursor: "pointer",
//                   marginRight: "16px",
//                 }}
//               >
//                 <Avatar
//                   style={{ backgroundColor: "#87d068" }}
//                   icon={<UserOutlined />}
//                 />
//                 <span style={{ marginLeft: "8px", fontWeight: 600 }}>
//                   Quản trị viên
//                 </span>
//               </div>
//             </Dropdown>
//           </div>
//         </Header>
//         <Content
//           style={{
//             margin: "20px 16px",
//             minHeight: 280,
//           }}
//         >
//           {props.children}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default MainLayout;
import React, { useContext, useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import ChatList from "./components/ChatList";
import { ChatContext } from "../../context/ChatContext";
import ChatBox from "./components/ChatBox";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";

type Props = {};

const Cskh: React.FC<Props> = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [sortedChats, setSortedChats] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State để lưu từ khóa tìm kiếm
  const [hasTimeoutRun, setHasTimeoutRun] = useState<boolean>(false); // State để kiểm tra nếu timeout đã chạy
  const prevUserChatsRef = useRef<any>([]);
  const dispatch = useDispatch();
  const location = useLocation();
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

    if (location.pathname === "/cskh" && !hasTimeoutRun) {
      dispatch(startLoading());
      timeoutId = setTimeout(() => {
        const sorted = sortChats(userChats || []);
        setSortedChats(sorted);
        prevUserChatsRef.current = userChats;
        dispatch(stopLoading());
        setHasTimeoutRun(true); // Đánh dấu rằng timeout đã chạy
      }, 2000); // Thời gian chờ 2 giây
    }

    return () => {
      clearTimeout(timeoutId); // Dọn dẹp timeout khi component unmount hoặc khi deps thay đổi
    };
  }, [userChats, notifications, dispatch, location.pathname, hasTimeoutRun]);

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
