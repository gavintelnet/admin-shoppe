import { Divider, Modal } from "antd";
import React from "react";

const ModalCapTren = (props: any) => {
  const { modalType, open, dataCapTren, handleClose } = props;
  let title = "";
  if (modalType === "tuyenTren") {
    title = "Thông tin cấp trên";
  }

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={"20%"}
    >
      <Divider />
      <div className="modal-content">
        <div className="info-row bold">
          <span className="info-label">ID</span>
          <span className="info-value">{dataCapTren.idCode}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Tên đầy đủ</span>
          <span className="info-value">{dataCapTren.name}</span>
        </div>
        <div className="info-row bold">
          <span className="info-label">Biệt danh</span>
          <span className="info-value">{dataCapTren.username}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Mã giới thiệu</span>
          <span className="info-value">{dataCapTren.inviteCode}</span>
        </div>
        <div className="info-row bold">
          <span className="info-label">Email</span>
          <span className="info-value">{dataCapTren.email}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Số điện thoại</span>
          <span className="info-value">{dataCapTren.phone}</span>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCapTren;
