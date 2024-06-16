import { Divider, Input, Modal } from "antd";
import { cardStyle } from "../../Deposit/Modals/ModalAction";
import { Tags } from "../../../components/Tag";
import formatCurrency from "../../../utils";
import DateTimeComponent from "../../../utils/DateTimeComponent";
import { useEffect, useState } from "react";

const { TextArea } = Input;
const ModalAdminChange = (props: any) => {
  const { open, onCancel, dataDetail } = props;
  let typeTrans = "";
  if (dataDetail.type === "deposit") {
    typeTrans = "Nạp tiền";
  } else if (dataDetail.type === "withdraw") {
    typeTrans = "Trừ tiền";
  } else if (dataDetail.type === "commission") {
    typeTrans = "Hoa hồng";
  } else if (dataDetail.type === "surplusToFreeze") {
    typeTrans = "Chuyển tiền từ ví người dùng chính sang ví đóng băng";
  } else if (dataDetail.type === "freezeToSurplus") {
    typeTrans = "Chuyển tiền từ ví đóng băng sang ví người dùng chính";
  }

  return (
    <Modal
      title={`Thông tin giao dịch - Mã: ${dataDetail.code}`}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Divider />
      <div style={cardStyle}>
        <div className="info-row">
          <span className="info-label">Mã giao dịch: </span>
          <span className="info-value">{dataDetail?.code}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Tài khoản: </span>
          <span className="info-value">
            {dataDetail?.customer?.username} / {dataDetail?.customer?.name}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Phương thức: </span>
          <span className="info-value">
            {dataDetail.type === "freezeToSurplus"
              ? "Ví đóng băng"
              : "Ví người dùng chính"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Loại giao dịch: </span>
          <span className="info-value">{typeTrans}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Trạng thái: </span>
          <span className="info-value">{Tags(dataDetail?.status)}</span>
        </div>
      </div>
      <Divider />
      <div style={cardStyle}>
        <div className="info-row">
          <span className="info-label">Số tiền: </span>
          <span className="info-value" style={{ fontWeight: 700 }}>
            {formatCurrency(dataDetail?.amount)}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Ngày giao dịch: </span>
          <span className="info-value">
            <DateTimeComponent dateString={dataDetail.createdAt} />
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Nội dung thực hiện: </span>
          <span className="info-value">{dataDetail?.message}</span>
        </div>
      </div>
      <Divider />
    </Modal>
  );
};
export default ModalAdminChange;
