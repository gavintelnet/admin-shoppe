import React, { useContext, useState } from "react";
import { CiBellOn } from "react-icons/ci";
import { ChatContext } from "../../../context/ChatContext";
import { unreadNotificationFunc } from "../../../utils/unreadNotifications";

const Notification = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const userData: any = localStorage.getItem("userData");
  const convertDtUser = JSON.parse(userData);
  const { notifications, userChats, allUsers } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationFunc(notifications);
  const modifiedNotifications = notifications.map((n: any) => {
    const sender = allUsers.find((user: any) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.username,
    };
  });
  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <CiBellOn size={24} />{" "}
        {unreadNotifications?.length === 0 ? null : (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 0,
              background: "red",
              color: "#fff",
              width: 10,
              height: 10,
              borderRadius: 20,
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Notification;
