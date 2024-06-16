import { Button, Card, Form, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getListUserAll } from "../../api/utils/auth";
import { showNotification } from "../../redux/reducers/notificationReducer";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";
import { createTransaction } from "../AdminChangeWallet/apis";

const ChuyenQuy = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [dataUser, setDataUser] = useState<any[]>([]);
  const [disabledFields, setDisabledFields] = useState({
    deposit: false,
    withdraw: false,
    commission: false,
  });

  const cardStyle = {
    flex: 1,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: 20,
  };
  useEffect(() => {
    const getListUser = async () => {
      try {
        const response: any = await getListUserAll();
        if (response.status) {
          const users = response.result
            .filter((user: any) => user.role === "Tài khoản thường")
            .map((user: any) => ({
              label: `${user.username} (${user.name})`,
              value: user._id,
            }));
          setDataUser(users);
        }
      } catch (err) {
        setDataUser([]);
        dispatch(
          showNotification({
            message: "Lấy dữ liệu khách hàng thất bại",
            type: "error",
          })
        );
      }
    };
    getListUser();
  }, [dispatch]);

  const onFinish = async (values: any) => {
    try {
      dispatch(startLoading());
      const rp = await createTransaction(values);
      if (rp.status) {
        dispatch(
          showNotification({
            message: rp.message,
            type: "success",
          })
        );
        form.resetFields();
      }else {
        dispatch(
          showNotification({
            message:rp.message,
            type: "error",
          })
        );
      }
    } catch (err) {
      dispatch(
        showNotification({
          message: "Lỗi hệ thống.",
          type: "error",
        })
      );
    } finally {
      dispatch(stopLoading());
    }
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="page-title">Chuyển quỹ tài khoản</h2>
      </div>
      <Card style={{ ...cardStyle }}>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 500 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Khách hàng"
            name="customer"
            rules={[
              { required: true, message: "Vui lòng nhập chọn khách hàng!" },
            ]}
          >
            <Select
              showSearch
              placeholder="Chọn khách hàng"
              optionFilterProp="children"
              filterOption={filterOption}
              options={dataUser}
            />
          </Form.Item>
          <Form.Item
            label="Chọn hình thức chuyển quỹ"
            name="type"
            rules={[
              { required: true, message: "Vui lòng nhập chọn một hình thức!" },
            ]}
          >
            <Select
              showSearch
              placeholder="Chọn hình thức chuyển quỹ"
              options={[
                {
                  value: "surplusToFreeze",
                  label: "Chuyển tiền từ ví người dùng chính sang ví đóng băng",
                },
                {
                  value: "freezeToSurplus",
                  label: "Chuyển tiền từ ví đóng băng sang ví người dùng chính",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Chuyển tiền"
            name="amount"
            rules={[{ required: true, message: "Vui lòng nhập số tiền!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập số tiền"
              disabled={disabledFields.deposit}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="button-main-page">
            Xác nhận
          </Button>
        </Form>
        <div style={{ marginTop: 30 }}>
          <p style={{ color: "#9E0101" }}>
            + Vui lòng chọn{" "}
            <span style={{ fontWeight: 600 }}>
              Chuyển tiền từ ví người dùng chính sang ví đóng băng
            </span>{" "}
            để cộng tiền vào tài khoản đóng băng.
          </p>
          <p style={{ color: "green" }}>
            + Vui lòng nhập{" "}
            <span style={{ fontWeight: 600 }}>
              Chuyển tiền từ ví đóng băng sang ví người dùng chính
            </span>{" "}
            để trừ tiền tài khoản.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ChuyenQuy;
