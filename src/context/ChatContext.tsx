// import React, {
//   createContext,
//   useEffect,
//   useState,
//   ReactNode,
//   useCallback,
// } from "react";
// import {
//   createMessageUserChat,
//   createUserChat,
//   getMessageUserChat,
//   getUserChat,
// } from "../api/utils/chat";

// import { io } from "socket.io-client";
// import audio from "../assets/sound-bet.mp3";
// import { SOCKET_URL } from "../api/endpoint";
// import { getListUserAll } from "../api/utils/auth";

// // Define types for User and Chat
// interface Chat {
//   _id: string;
//   members: string[];
//   [key: string]: any; // Use this if the chat object can have other properties
// }

// // Define the context type
// interface ChatContextType {
//   userChats: Chat[] | null;
//   isUserChatsLoading: boolean;
//   userChatsError: string | null;
//   potentialChats: [];
//   createChat: (firstId: string, secondId: string) => Promise<void>;
//   updateCurrentChat: (chat: any) => Promise<void>;
//   currentChat: any;
//   messages: any;
//   isMessagesLoading: boolean;
//   messageError: string | null;
//   sendTextMessageError: null;
//   newMessage: null;
//   sendTextMessage: (
//     textMessage: any,
//     senderId: any,
//     currentChatId: any,
//     setTextMessage: any
//   ) => Promise<void>;
//   onlineUsers: any;
//   notifications: any;
//   markNotificationsAsRead: (n: any, userChats: any, notifications: any) => void;
//   markThisUserNotificationsAsRead: (
//     thisUserNotifications: any,
//     notifications: any
//   ) => void;
//   setIsChatOpen: (isOpen: boolean) => void;
//   isChatOpen: boolean;
//   setUserChats: any;
//   allUsers: any;
// }

// // Create the context with a default value
// export const ChatContext = createContext<ChatContextType>({
//   userChats: null,
//   isUserChatsLoading: false,
//   userChatsError: null,
//   potentialChats: [],
//   createChat: async () => {},
//   updateCurrentChat: async () => {},
//   currentChat: null,
//   messages: null,
//   isMessagesLoading: false,
//   messageError: null,
//   sendTextMessageError: null,
//   newMessage: null,
//   sendTextMessage: async () => {},
//   onlineUsers: null,
//   notifications: [],
//   markNotificationsAsRead: () => {},
//   markThisUserNotificationsAsRead: () => {},
//   setIsChatOpen: () => {},
//   isChatOpen: false,
//   setUserChats: null,
//   allUsers: [],
// });

// interface ChatContextProviderProps {
//   children: ReactNode;
//   isLogin: boolean;
//   user: any;
// }

// export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
//   children,
//   isLogin,
//   user,
// }) => {
//   const [userChats, setUserChats] = useState<Chat[] | null>(null);
//   const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
//   const [userChatsError, setUserChatsError] = useState<string | null>(null);
//   const [potentialChats, setPotentialChats] = useState<any>([]);
//   const [currentChat, setCurrentChat] = useState<any>(null);
//   const [messages, setMessages] = useState<any>(null);
//   const [isMessagesLoading, setIsMessagesLoading] = useState(false);
//   const [messageError, setMessageError] = useState<any>(null);
//   const [sendTextMessageError, setSendTextMessageError] = useState<any>(null);
//   const [newMessage, setNewMessage] = useState<any>(null);
//   const [socket, setSocket] = useState<any>(null);
//   const [onlineUsers, setOnlineUsers] = useState<any>(null);
//   const [notifications, setNotifications] = useState<any>([]);
//   const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
//   const [allUsers, setAllUsers] = useState<any>([]);

//   const notificationSound = new Audio(audio);

//   useEffect(() => {
//     if ((user?._id, isLogin)) {
//       const newSocket = io(SOCKET_URL);
//       setSocket(newSocket);

//       newSocket.emit("addNewUser", {
//         userId: user?._id,
//         role: "Quản trị viên",
//       });

//       console.log("hihihihi");
//       return () => {
//         newSocket.disconnect();
//       };
//     }
//   }, [user?._id, isLogin]);

//   ///add online
//   useEffect(() => {
//     if (socket === null) return;
//     socket.emit("addNewUser", "666bbbbe3e77ff36ae8f7f68");
//     socket.on("getOnlineUsers", (res: any) => {
//       setOnlineUsers(res);
//     });

//     return () => {
//       socket.off("getOnlineUsers");
//     };
//   }, [socket]);

//   useEffect(() => {
//     if (socket === null || !newMessage) return;
//     const recipient = currentChat?.members?.find(
//       (member: any) => member._id !== user?._id
//     );
//     const recipientId = recipient?._id;
//     socket.emit("sendMessage", {
//       ...newMessage,
//       recipientId,
//       role: "Quản trị viên",
//     });
//   }, [newMessage, currentChat, socket, user?._id]);

//   // receive message and notification
//   useEffect(() => {
//     if (socket === null) return;

//     socket.on("getMessage", (res: any) => {
//       if (currentChat?._id === res.chatId) {
//         setMessages((prev: any) => [...prev, res]);
//       } else {
//         // Add a notification if the chat is not open
//         setNotifications((prev: any) => [res, ...prev]);
//         if (!isChatOpen) {
//           notificationSound.play();
//         }
//       }
//     });

//     socket.on("getNotification", (res: any) => {
//       const isChatOpen = currentChat?.members?.some(
//         (member: any) => member?._id === res.senderId
//       );

//       if (isChatOpen) {
//         setNotifications((prev: any) => [{ ...res, isRead: true }, ...prev]);
//         notificationSound.play();
//       } else {
//         setNotifications((prev: any) => [{ ...res, isRead: false }, ...prev]);
//         notificationSound.play();
//       }
//     });

//     return () => {
//       socket.off("getMessage");
//       socket.off("getNotification");
//     };
//   }, [socket, currentChat, isChatOpen]);

//   useEffect(() => {
//     const getUsers = async () => {
//       if (isLogin) {
//         try {
//           const response = await getListUserAll();
//           if (response.status) {
//             const pChats = response.result.filter((u: any) => {
//               let isChatCreated = false;

//               if (u?._id === "666bbbbe3e77ff36ae8f7f68") return false;

//               if (userChats) {
//                 isChatCreated = userChats?.some((chat) => {
//                   return chat?.members?.includes(u?._id);
//                 });
//               }

//               return !isChatCreated;
//             });
//             setPotentialChats(pChats);
//             setAllUsers(response.result);
//           }
//         } catch (e: any) {
//           console.error(e);
//         }
//       }
//     };
//     getUsers();
//   }, [isLogin, userChats, "666bbbbe3e77ff36ae8f7f68"]);

//   useEffect(() => {
//     const getUserChats = async () => {
//       if (isLogin) {
//         setIsUserChatsLoading(true);
//         try {
//           const response = await getUserChat("666bbbbe3e77ff36ae8f7f68");
//           if (response.status) {
//             setUserChats(response.result);
//           } else {
//             setUserChatsError(response.message);
//           }
//         } catch (e: any) {
//           setUserChatsError(e.message);
//         } finally {
//           setIsUserChatsLoading(false);
//         }
//       }
//     };
//     getUserChats();
//   }, ["666bbbbe3e77ff36ae8f7f68", isLogin]);

//   // messages
//   useEffect(() => {
//     const getMessages = async () => {
//       if (isLogin) {
//         setIsMessagesLoading(true);
//         try {
//           const response = await getMessageUserChat(currentChat?._id);
//           if (response.status) {
//             setMessages(response.result);
//           } else {
//             setMessageError(response.message);
//           }
//         } catch (e: any) {
//           // setMessageError(e.message);
//         } finally {
//           setIsMessagesLoading(false);
//         }
//       }
//     };
//     getMessages();
//   }, [currentChat, isLogin, "666bbbbe3e77ff36ae8f7f68"]);

//   const sendTextMessage = useCallback(
//     async (
//       textMessage: any,
//       senderId: any,
//       currentChatId: any,
//       setTextMessage: any
//     ) => {
//       let payload = {
//         chatId: currentChatId,
//         senderId: senderId,
//         text: textMessage,
//       };
//       try {
//         const response = await createMessageUserChat(payload);
//         if (response.status) {
//           setNewMessage(response.result);
//           setMessages((prev: any) => [...prev, response.result]);
//           setTextMessage("");
//         } else {
//           setSendTextMessageError(response.message);
//         }
//       } catch (e: any) {
//       } finally {
//       }
//     },
//     []
//   );

//   const updateCurrentChat = useCallback(async (chat: any) => {
//     setCurrentChat(chat);
//     setIsChatOpen(true); // Set chat open state to true when chat is updated
//   }, []);

//   // Tạo cuộc trò chuyện mới
//   const createChat = useCallback(async (firstId: string, secondId: string) => {
//     let payload = {
//       firstId: firstId,
//       secondId: secondId,
//     };
//     try {
//       const response = await createUserChat(payload);
//       if (response.status) {
//         setUserChats((prev: any) => [...prev, response.result]);
//       }
//     } catch (e: any) {
//     } finally {
//     }
//   }, []);

//   const markNotificationsAsRead = useCallback(
//     (n: any, userChats: any, notifications: any) => {
//       // FIND CHAT TO OPEN
//       const desiredChat = userChats.find((chat: any) => {
//         const chatMembers = ["666bbbbe3e77ff36ae8f7f68", n.senderId];
//         const isDesiredChat = chat?.members.every((member: any) => {
//           return chatMembers.includes(member);
//         });

//         return isDesiredChat;
//       });

//       //mark notification add read
//       const mNotifications = notifications.map((el: any) => {
//         if (n.senderId === el.senderId) {
//           return { ...n, isRead: true };
//         } else {
//           return el;
//         }
//       });
//       updateCurrentChat(desiredChat);
//       setNotifications(mNotifications);
//     },
//     []
//   );

//   const markThisUserNotificationsAsRead = useCallback(
//     (thisUserNotifications: any, notifications: any) => {
//       const mNotifications = notifications.map((el: any) => {
//         let notification;
//         thisUserNotifications.forEach((n: any) => {
//           if (n.senderId === el.senderId) {
//             notification = { ...n, isRead: true };
//           } else {
//             notification = el;
//           }
//         });

//         return notification;
//       });

//       setNotifications(mNotifications);
//     },
//     []
//   );
//   return (
//     <ChatContext.Provider
//       value={{
//         userChats,
//         isUserChatsLoading,
//         userChatsError,
//         potentialChats,
//         createChat,
//         updateCurrentChat,
//         currentChat,
//         messages,
//         isMessagesLoading,
//         messageError,
//         sendTextMessageError,
//         newMessage,
//         sendTextMessage,
//         onlineUsers,
//         notifications,
//         markNotificationsAsRead,
//         markThisUserNotificationsAsRead,
//         isChatOpen,
//         setIsChatOpen,
//         setUserChats,
//         allUsers,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  createMessageUserChat,
  createUserChat,
  getMessageUserChat,
  getUserChat,
} from "../api/utils/chat";
import { io } from "socket.io-client";
import audio from "../assets/sound-bet.mp3";
import { SOCKET_URL } from "../api/endpoint";
import { getListUserAll } from "../api/utils/auth";

interface Chat {
  _id: string;
  members: string[];
  lastMessageTime: string; // Ensure this field exists
  [key: string]: any;
}

interface Notification {
  chatId: string;
  isRead: boolean;
  senderId: string;
  [key: string]: any;
}

interface ChatContextType {
  userChats: Chat[] | null;
  isUserChatsLoading: boolean;
  userChatsError: string | null;
  potentialChats: Chat[];
  createChat: (firstId: string, secondId: string) => Promise<void>;
  updateCurrentChat: (chat: Chat) => Promise<void>;
  currentChat: Chat | null;
  messages: any[];
  isMessagesLoading: boolean;
  messageError: string | null;
  sendTextMessageError: string | null;
  newMessage: any | null;
  sendTextMessage: (
    textMessage: string,
    senderId: string,
    currentChatId: string,
    setTextMessage: React.Dispatch<React.SetStateAction<string>>
  ) => Promise<void>;
  onlineUsers: any[];
  notifications: Notification[];
  markNotificationsAsRead: (
    n: Notification,
    userChats: Chat[],
    notifications: Notification[]
  ) => void;
  markThisUserNotificationsAsRead: (
    thisUserNotifications: Notification[],
    notifications: Notification[]
  ) => void;
  setIsChatOpen: (isOpen: boolean) => void;
  isChatOpen: boolean;
  setUserChats: React.Dispatch<React.SetStateAction<Chat[] | null>>;
  allUsers: any[];
}

export const ChatContext = createContext<ChatContextType>({
  userChats: null,
  isUserChatsLoading: false,
  userChatsError: null,
  potentialChats: [],
  createChat: async () => {},
  updateCurrentChat: async () => {},
  currentChat: null,
  messages: [],
  isMessagesLoading: false,
  messageError: null,
  sendTextMessageError: null,
  newMessage: null,
  sendTextMessage: async () => {},
  onlineUsers: [],
  notifications: [],
  markNotificationsAsRead: () => {},
  markThisUserNotificationsAsRead: () => {},
  setIsChatOpen: () => {},
  isChatOpen: false,
  setUserChats: () => {},
  allUsers: [],
});

interface ChatContextProviderProps {
  children: ReactNode;
  isLogin: boolean;
  user: any;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
  children,
  isLogin,
  user,
}) => {
  const [userChats, setUserChats] = useState<Chat[] | null>(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
  const [userChatsError, setUserChatsError] = useState<string | null>(null);
  const [potentialChats, setPotentialChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [sendTextMessageError, setSendTextMessageError] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState<any | null>(null);
  const [socket, setSocket] = useState<any | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const notificationSound = new Audio(audio);

  const sortChats = (chats: Chat[]) => {
    return [...chats].sort((a, b) => {
      const aLastMessageDate = new Date(a.lastMessageTime).getTime();
      const bLastMessageDate = new Date(b.lastMessageTime).getTime();

      const aHasUnreadNotification = notifications.some(
        (n) => n.chatId === a._id && !n.isRead
      );
      const bHasUnreadNotification = notifications.some(
        (n) => n.chatId === b._id && !n.isRead
      );

      if (aHasUnreadNotification && !bHasUnreadNotification) return -1;
      if (!aHasUnreadNotification && bHasUnreadNotification) return 1;

      return bLastMessageDate - aLastMessageDate;
    });
  };

  useEffect(() => {
    if ((user?._id, isLogin)) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.emit("addNewUser", {
        userId: user?._id,
        role: "Quản trị viên",
      });

      console.log("Socket connected");
      return () => {
        newSocket.disconnect();
      };
    }
  }, [user?._id, isLogin]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", "666bbbbe3e77ff36ae8f7f68");
    socket.on("getOnlineUsers", (res: any) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  useEffect(() => {
    if (socket === null || !newMessage) return;
    const recipient = currentChat?.members?.find(
      (member: any) => member._id !== user?._id
    );
    const recipientId: any = recipient?._id;
    socket.emit("sendMessage", {
      ...newMessage,
      recipientId,
      role: "Quản trị viên",
    });
  }, [newMessage, currentChat, socket, user?._id]);

  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res: any) => {
      if (currentChat?._id === res.chatId) {
        setMessages((prev) => [...prev, res]);
      } else {
        setNotifications((prev) => [res, ...prev]);
        setUserChats((prevChats) => {
          const updatedChats =
            prevChats?.map((chat) => {
              if (chat._id === res.chatId) {
                chat.lastMessageTime = res.createdAt;
              }
              return chat;
            }) || [];
          return sortChats(updatedChats);
        });
        if (!isChatOpen) {
          notificationSound.play();
        }
      }
    });

    socket.on("getNotification", (res: any) => {
      const isChatOpen = currentChat?.members?.some(
        (member: any) => member?._id === res.senderId
      );

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
        notificationSound.play();
      } else {
        setNotifications((prev) => [{ ...res, isRead: false }, ...prev]);
        notificationSound.play();
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat, isChatOpen]);

  useEffect(() => {
    const getUsers = async () => {
      if (isLogin) {
        try {
          const response = await getListUserAll();
          if (response.status) {
            const pChats = response.result.filter((u: any) => {
              let isChatCreated = false;

              if (u?._id === "666bbbbe3e77ff36ae8f7f68") return false;

              if (userChats) {
                isChatCreated = userChats?.some((chat: Chat) => {
                  return chat?.members?.includes(u?._id);
                });
              }

              return !isChatCreated;
            });
            setPotentialChats(pChats);
            setAllUsers(response.result);
          }
        } catch (e: any) {
          console.error(e);
        }
      }
    };
    getUsers();
  }, [isLogin, userChats, "666bbbbe3e77ff36ae8f7f68"]);

  useEffect(() => {
    const getUserChats = async () => {
      if (isLogin) {
        setIsUserChatsLoading(true);
        try {
          const response = await getUserChat("666bbbbe3e77ff36ae8f7f68");
          if (response.status) {
            setUserChats(response.result);
          } else {
            setUserChatsError(response.message);
          }
        } catch (e: any) {
          setUserChatsError(e.message);
        } finally {
          setIsUserChatsLoading(false);
        }
      }
    };
    getUserChats();
  }, ["666bbbbe3e77ff36ae8f7f68", isLogin]);

  useEffect(() => {
    const getMessages = async () => {
      if (isLogin) {
        setIsMessagesLoading(true);
        try {
          const response = await getMessageUserChat(currentChat?._id);
          if (response.status) {
            setMessages(response.result);
          } else {
            setMessageError(response.message);
          }
        } catch (e: any) {
          setMessageError(e.message);
        } finally {
          setIsMessagesLoading(false);
        }
      }
    };
    getMessages();
  }, [currentChat, isLogin, "666bbbbe3e77ff36ae8f7f68"]);

  const sendTextMessage = useCallback(
    async (
      textMessage: string,
      senderId: string,
      currentChatId: string,
      setTextMessage: any,
      setKey: any,
      image: any,
      setImage: any,
      setPreview: any,
      setSelectedFile: any
    ) => {
      let payload: any = {
        chatId: currentChatId,
        senderId: senderId,
        // text: textMessage,
      };

      if (textMessage && textMessage !== "") {
        payload.text = textMessage;
      }

      if (image) {
        payload.image = image;
      }
      try {
        setKey(true);
        const response = await createMessageUserChat(payload);
        if (response.status) {
          setNewMessage(response.result);
          setMessages((prev) => [...prev, response.result]);
          setTextMessage("");
          setKey(false);
          setImage(null);
          setPreview(null);
          setSelectedFile(null);
          setUserChats((prevChats) => {
            const updatedChats =
              prevChats?.map((chat) => {
                if (chat._id === response.result.chatId) {
                  chat.lastMessageTime = response.result.createdAt;
                }
                return chat;
              }) || [];
            return sortChats(updatedChats);
          });
        } else {
          setSendTextMessageError(response.message);
        }
      } catch (e: any) {
        setSendTextMessageError(e.message);
      } finally {
        setKey(false);
      }
    },
    []
  );

  const updateCurrentChat = useCallback(async (chat: Chat) => {
    setCurrentChat(chat);
    setIsChatOpen(true);
  }, []);

  const createChat = useCallback(async (firstId: string, secondId: string) => {
    let payload = {
      firstId: firstId,
      secondId: secondId,
    };
    try {
      const response = await createUserChat(payload);
      if (response.status) {
        setUserChats((prev: any) => [...prev, response.result]);
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }, []);

  const markNotificationsAsRead = useCallback(
    (n: Notification, userChats: Chat[], notifications: Notification[]) => {
      const desiredChat = userChats.find((chat) => {
        const chatMembers = ["666bbbbe3e77ff36ae8f7f68", n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });

      const mNotifications = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });
      updateCurrentChat(desiredChat as Chat);
      setNotifications(mNotifications);
    },
    []
  );

  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications: Notification[], notifications: Notification[]) => {
      const mNotifications: any = notifications.map((el: any) => {
        let notification;
        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });

        return notification;
      });

      setNotifications(mNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isMessagesLoading,
        messageError,
        sendTextMessageError,
        newMessage,
        sendTextMessage,
        onlineUsers,
        notifications,
        markNotificationsAsRead,
        markThisUserNotificationsAsRead,
        isChatOpen,
        setIsChatOpen,
        setUserChats,
        allUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
