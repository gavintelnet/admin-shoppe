import { Button, Divider, Modal } from "antd";
import { Tags } from "../../../components/Tag";
import formatCurrency from "../../../utils";
import DateTimeComponent from "../../../utils/DateTimeComponent";
import { Input } from "antd";
import { useDispatch } from "react-redux";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import { useEffect, useState } from "react";
import { changeStatusDraw } from "../apis";

const { TextArea } = Input;
const ModalAction = (props: any) => {
  const { open, onCancel, dataDetail, refecth } = props;
  const userData = localStorage.getItem("userData");
  const user: any = userData ? JSON.parse(userData) : null;
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (dataDetail?.message) {
      setMessage(dataDetail.message);
    } else {
      setMessage("");
    }
  }, [dataDetail]);

  const handleConfirm = async () => {
    try {
      dispatch(startLoading());
      let payload = {
        handle: user._id,
        status: "Đã hoàn thành",
      };
      const rp = await changeStatusDraw(dataDetail._id, payload);
      if (rp.status) {
        dispatch(
          showNotification({
            message: rp.message,
            type: "success",
          })
        );
        setMessage("");
        onCancel();
        refecth();
      } else {
        dispatch(
          showNotification({
            message: rp.message,
            type: "error",
          })
        );
      }
    } catch (err) {
      dispatch(
        showNotification({
          message: "Thay đổi trạng thái thất bại!",
          type: "error",
        })
      );
    } finally {
      setMessage("");
      dispatch(stopLoading());
    }
  };
  const handleReject = async () => {
    try {
      dispatch(startLoading());
      let payload = {
        handle: user._id,
        status: "Từ chối",
        message: message,
      };
      const rp = await changeStatusDraw(dataDetail._id, payload);
      if (rp.status) {
        dispatch(
          showNotification({
            message: rp.message,
            type: "success",
          })
        );
        setMessage("");
        onCancel();
        refecth();
      }
    } catch (err) {
      dispatch(
        showNotification({
          message: "Thay đổi trạng thái thất bại!",
          type: "success",
        })
      );
    } finally {
      dispatch(stopLoading());
      setMessage("");
    }
  };

  return (
    <Modal
      title={`Thông tin giao dịch - Hóa đơn: ${dataDetail.code}`}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Divider />
      <div style={cardStyle}>
        <div className="info-row">
          <span className="info-label">Mã đơn hàng: </span>
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
          <span className="info-value">Ví người dùng chính</span>
        </div>
        <div className="info-row">
          <span className="info-label">Loại giao dịch: </span>
          <span className="info-value">Rút tiền</span>
        </div>
        <div className="info-row">
          <span className="info-label">Trạng thái: </span>
          <span className="info-value">{Tags(dataDetail?.status)}</span>
        </div>
      </div>
      <Divider />
      <div style={cardStyle}>
        <div className="info-row">
          <span className="info-label">Ngân hàng: </span>
          <span className="info-value">
            {dataDetail?.customer?.bank?.[0]?.bankName
              ? dataDetail?.customer?.bank?.[0]?.bankName
              : "Chưa điền thông tin"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Số tài khoản: </span>
          <span className="info-value">
            {" "}
            {dataDetail?.customer?.bank?.[0]?.bankNumber
              ? dataDetail?.customer?.bank?.[0]?.bankNumber
              : "Chưa điền thông tin"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Chủ tài khoản: </span>
          <span className="info-value">
            {" "}
            {dataDetail?.customer?.bank?.[0]?.bankOwner
              ? dataDetail?.customer?.bank?.[0]?.bankOwner
              : "Chưa điền thông tin"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Số điện thoại: </span>
          <span className="info-value">{dataDetail?.customer?.phone}</span>
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
          <span className="info-value">{dataDetail?.note}</span>
        </div>
      </div>
      <Divider />
      <span className="info-label">Lý do từ chối: </span>
      <TextArea
        rows={4}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      {dataDetail?.status === "Đang chờ xử lý" && (
        <div
          style={{ marginTop: 15, display: "flex", justifyContent: "center" }}
        >
          <Button type="primary" onClick={handleReject} danger>
            Từ chối
          </Button>
          <Button
            type="primary"
            onClick={handleConfirm}
            className="button-main-page"
            style={{ marginLeft: 8 }}
          >
            Xác nhận
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ModalAction;

export const cardStyle = {
  flex: 1,
};

export const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
};

export const infoLabelStyle = {
  fontWeight: "bold",
  marginRight: "10px",
};

export const infoValueStyle = {
  textAlign: "right",
  wordBreak: "break-word",
};
