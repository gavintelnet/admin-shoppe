import { Button, Form } from "antd";
import React, { useEffect, useState } from "react";
import CardInfo from "./components/CardInfo";
import TableListUser from "./components/TableListUser";
import ModalCreateUser from "../../components/ModalUser/ModalCreateUser";
import { useDispatch } from "react-redux";
import useRefresh from "../../hooks/useRefresh";
import { createUser, getListUser } from "./apis";
import { showNotification } from "../../redux/reducers/notificationReducer";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";
import { getAllWithdraw } from "../Withdraw/apis";
import { getAllDeposit } from "../Deposit/apis";

const Users = (props: any) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm<any>();
  const [refresh, refecth] = useRefresh();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalUser, setTotalUser] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
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
    try {
      dispatch(startLoading());
      const response = await createUser(values);
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
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseAllWithdraw, responseAllDeposit, responseListUser] =
          await Promise.all([
            getAllWithdraw({ page: 0, size: 10 }),
            getAllDeposit({ page: 0, size: 10 }),
            getListUser({ page: 0, size: 10 }),
          ]);
        if (responseAllWithdraw.status) {
          setTotalWithdraw(responseAllWithdraw.result.totalCompletedAmount);
        }
        if (responseAllDeposit.status) {
          setTotalDeposit(responseAllDeposit.result.totalCompletedAmount);
        }
        if (responseListUser.status) {
          setTotalUser(responseListUser.result.pagination?.total);
        }
      } catch (err) {}
    };
    fetchData();
  }, []);
  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="page-title">Người dùng</h2>
        <div className="page-create">
          <Button className="button-header-page" onClick={showModal}>
            Tạo tài khoản
          </Button>
        </div>
      </div>
      <CardInfo
        totalUser={totalUser}
        totalDeposit={totalDeposit}
        totalWithdraw={totalWithdraw}
      />
      <TableListUser
        refresh={refresh}
        refecth={refecth}
        tableType="info"
        setTotalUser={setTotalUser}
      />
      <ModalCreateUser
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      />
    </div>
  );
};

export default Users;
