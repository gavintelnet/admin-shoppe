import { Button, Divider, Modal, Select } from "antd";
import { Tags } from "../../../components/Tag";
import formatCurrency from "../../../utils";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";
import { changeStatusOrder } from "../apis";
import { showNotification } from "../../../redux/reducers/notificationReducer";

const ModalStatusOrder = (props: any) => {
  const { open, onCancel, dataDetail, refecth } = props;
  const [status, setStatus] = useState<string>("");
  const handleChange = (value: string) => {
    setStatus(value);
  };
  const dispatch = useDispatch();
  const handleConfirm = async () => {
    try {
      let payload = {
        status: status,
      };
      dispatch(startLoading());
      const rp = await changeStatusOrder(dataDetail._id, payload);
      if (rp.status) {
        dispatch(
          showNotification({
            message: "Cập nhật trạng thái thành công.",
            type: "success",
          })
        );
        setStatus("");
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
    } finally {
      dispatch(stopLoading());
    }
  };
  return (
    <Modal
      title={`Thông tin đơn hàng - Hóa đơn: ${dataDetail.code}`}
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
          <span className="info-label">Ngày mua hàng: </span>
          <span className="info-value">{dataDetail.createdAt}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Tài khoản: </span>
          <span className="info-value">
            {dataDetail?.customer?.username} / {dataDetail?.customer?.name}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Trạng thái: </span>
          <span className="info-value">{Tags(dataDetail?.orderStatus)}</span>
        </div>
      </div>
      <Divider />
      <div style={cardStyle}>
        <div className="info-row">
          <span className="info-label">
            {dataDetail && dataDetail?.orderItems?.[0]?.product?.category?.name}{" "}
            (Hoàn trả{" "}
            {dataDetail &&
              dataDetail?.orderItems?.[0]?.product?.category?.commission}{" "}
            %)
          </span>
        </div>
        <div className="info-row">
          <span style={{ maxWidth: 210 }}>
            {dataDetail && dataDetail?.orderItems?.[0]?.product?.name}{" "}
          </span>
          <span className="info-value">
            {formatCurrency(dataDetail?.orderItems?.[0]?.price || 0)} x{" "}
            {dataDetail?.orderItems?.[0]?.quantity || 0} =
            {formatCurrency(
              (dataDetail?.orderItems?.[0]?.price || 0) *
                (dataDetail?.orderItems?.[0]?.quantity || 0)
            )}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Hoa hồng: </span>
          <span className="info-value">
            {formatCurrency(
              ((dataDetail?.orderItems?.[0]?.price || 0) *
                (dataDetail?.orderItems?.[0]?.quantity || 0) *
                (dataDetail?.orderItems?.[0]?.commission || 0)) /
                100
            )}
          </span>
        </div>
      </div>
      <Divider />
      <div style={cardStyle}>
        <div className="info-row">
          <span className="info-label">Tổng giá trị: </span>
          <span className="info-value">
            {" "}
            {formatCurrency(dataDetail?.totalPrice || 0)}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Hoa hồng: </span>
          <span className="info-value">
            {formatCurrency(dataDetail?.totalCommission || 0)}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Tổng tiền hoàn: </span>
          <span className="info-value">
            {formatCurrency(
              (dataDetail?.totalPrice || 0) + (dataDetail?.totalCommission || 0)
            )}
          </span>
        </div>
        <div className="info-row" style={{ marginTop: 20 }}>
          <Select
            defaultValue="Chọn trạng thái"
            onChange={handleChange}
            style={{ width: "100%" }}
            options={[
              { value: "", label: "Tất cả" },
              { value: "Chờ thanh toán", label: "Chờ thanh toán" },
              { value: "Đang kiểm duyệt", label: "Đang kiểm duyệt" },
              { value: "Hoàn thành", label: "Hoàn thành" },
              { value: "Huỷ", label: "Huỷ" },
            ]}
          />
        </div>
      </div>
      <div style={{ marginTop: 35, display: "flex", justifyContent: "center" }}>
        <Button onClick={onCancel}>Đóng</Button>
        <Button
          type="primary"
          onClick={handleConfirm}
          className="button-main-page"
          style={{ marginLeft: 8 }}
        >
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};
export default ModalStatusOrder;
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
