import { Button, Form } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useRefresh from "../../hooks/useRefresh";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";
import { createUser } from "./apis";
import { showNotification } from "../../redux/reducers/notificationReducer";
import TableListUser from "./components/TableListUser";
import ModalCreateUser from "../../components/ModalUser/ModalCreateUser";

const UserAgentcy = (props: any) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm<any>();
  const [refresh, refecth] = useRefresh();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const onFinish = async (values: any) => {
    let payload = {
      ...values,
      position: "Đại lý",
    };
    try {
      dispatch(startLoading());
      const response = await createUser(payload);
      if (response.status) {
        dispatch(
          showNotification({
            message: response.message,
            type: "success",
          })
        );
        handleCancel();
        refecth();
      } else {
        dispatch(
          showNotification({
            message: response.message,
            type: "error",
          })
        );
      }
    } catch (error: any) {
      dispatch(
        showNotification({
          message: error.response?.data?.message || error.message,
          type: "error",
        })
      );
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="page-title">Đại lý</h2>
        <div className="page-create">
          <Button className="button-header-page" onClick={showModal}>
            Thêm đại lý
          </Button>
        </div>
      </div>
      <TableListUser refresh={refresh} refecth={refecth} tableType="agency" />
      <ModalCreateUser
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        form={form}
        onFinish={onFinish}
        agency="agency"
      />
    </div>
  );
};

export default UserAgentcy;
