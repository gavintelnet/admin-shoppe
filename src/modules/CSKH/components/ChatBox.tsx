import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../../context/ChatContext";
import { FiImage, FiSend } from "react-icons/fi";
import DateTimeComponent from "../../../utils/DateTimeComponent";
import { Image, Spin } from "antd";

const fileToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const ChatBox = (props: any) => {
  const { selectedUser, onlineUsers, recipientUser } = props;
  const { currentChat, messages, isMessagesLoading, sendTextMessage } =
    useContext(ChatContext);

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [key, setKey] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      setImage(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    const convertFileToBase64 = async () => {
      const base64Image: any = await fileToBase64(selectedFile);
      setImage(base64Image);
    };

    convertFileToBase64();

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    await sendTextMessage(
      message,
      "666bbbbe3e77ff36ae8f7f68",
      currentChat?._id,
      setMessage,
      setKey,
      image,
      setImage,
      setPreview,
      setSelectedFile
    );
  };
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  return (
    <div className="chat-main">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="user-name">
            {selectedUser ? recipientUser?.username : "Chọn đoạn chat"}
          </div>
          <div className="last-seen">
            {onlineUsers?.some(
              (user: any) => user?.userId === recipientUser?._id
            )
              ? "Đang hoạt động"
              : "Dừng hoạt động"}
          </div>
        </div>
        <div className="chat-header-actions"></div>
      </div>
      <div className={`chat-messages ${key ? "loadingBg" : ""}`}>
        {isMessagesLoading && <p>Loading chat ...</p>}
        {!selectedUser && (
          <p style={{ textAlign: "center" }}>
            Chưa có cuộc trò chuyện nào được chọn...
          </p>
        )}

        {!isMessagesLoading &&
          selectedUser &&
          messages &&
          messages.map((message: any, index: any) => (
            <div
              key={message.id}
              className={`chat-message ${
                message.senderId === "666bbbbe3e77ff36ae8f7f68" ? "me" : "other"
              }`}
            >
              <div className="message-content-image">
                {message?.images?.url && (
                  <Image src={message?.images.url} alt="Image" />
                )}
              </div>
              {message.text && (
                <div className="message-text">{message.text}</div>
              )}

              <div className="message-timestamp">
                <DateTimeComponent dateString={message.createdAt} />
              </div>
            </div>
          ))}
        {key && (
          <div className="chat-loading">
            <Spin />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {preview && (
        <div className="image-preview">
          <Image src={preview} alt="Preview" />
        </div>
      )}
      <div className="chat-input">
        <input
          type="file"
          onChange={(e: any) => setSelectedFile(e.target.files[0])}
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload" className="upload-button">
          <FiImage size={24} />
        </label>
        <input
          type="text"
          placeholder="Nhập nội dung..."
          value={message}
          onChange={handleInputChange}
        />
        <button onClick={(e: any) => handleSendMessage(e)} disabled={key}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
