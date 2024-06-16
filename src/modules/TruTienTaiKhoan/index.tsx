import { Button, Card, Form, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getListUserAll } from "../../api/utils/auth";
import { showNotification } from "../../redux/reducers/notificationReducer";
import { createTransaction } from "../AdminChangeWallet/apis";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";

const TruTienTaiKhoan = () => {
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
    let payload: any = {
      customer: values.customer,
    };

    if (values.deposit) {
      payload.type = "deposit";
      payload.amount = values.deposit;
    } else if (values.withdraw) {
      payload.type = "withdraw";
      payload.amount = values.withdraw;
    } else if (values.commission) {
      payload.type = "commission";
      payload.amount = values.commission;
    }
    try {
      dispatch(startLoading());
      const rp = await createTransaction(payload);
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

  const handleFieldChange = (changedFields: any, allFields: any) => {
    const deposit = allFields.find(
      (field: any) => field.name[0] === "deposit"
    )?.value;
    const withdraw = allFields.find(
      (field: any) => field.name[0] === "withdraw"
    )?.value;
    const commission = allFields.find(
      (field: any) => field.name[0] === "commission"
    )?.value;

    setDisabledFields({
      deposit: !!withdraw || !!commission,
      withdraw: !!deposit || !!commission,
      commission: !!deposit || !!withdraw,
    });
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="page-title">Trừ tiền tài khoản</h2>
      </div>
      <Card style={{ ...cardStyle }}>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 500 }}
          onFinish={onFinish}
          onFieldsChange={handleFieldChange}
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

          <Form.Item label="Nạp tiền tài khoản" name="deposit">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập số tiền"
              disabled={disabledFields.deposit}
            />
          </Form.Item>
          <Form.Item label="Trừ tiền tài khoản" name="withdraw">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập số tiền"
              disabled={disabledFields.withdraw}
            />
          </Form.Item>
          <Form.Item label="Hoa hồng" name="commission">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập số tiền"
              disabled={disabledFields.commission}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="button-main-page">
            Xác nhận
          </Button>
        </Form>
        <div style={{ marginTop: 30 }}>
          <p style={{ color: "green" }}>
            + Vui lòng nhập <span style={{ fontWeight: 600 }}>nạp bù</span> để
            cộng tiền vào tài khoản.
          </p>
          <p style={{ color: "#9E0101" }}>
            + Vui lòng nhập{" "}
            <span style={{ fontWeight: 600 }}>trừ tiền rút</span> để trừ tiền
            tài khoản.
          </p>
          <p>
            + Vui lòng nhập <span style={{ fontWeight: 600 }}>Hoa hồng</span> để
            cộng tiền hoa hồng vào tài khoản.
          </p>
          <p>
            + Vui lòng nhập{" "}
            <span style={{ fontWeight: 600 }}>Bonus - phần thưởng</span> để cộng
            tiền thưởng vào tài khoản.
          </p>
          <p>
            + Vui lòng nhập{" "}
            <span style={{ fontWeight: 600 }}>Hoàn tiền hàng</span> để cộng tiền
            vào tài khoản.
          </p>
          <p style={{ color: "#9E0101", fontWeight: 600 }}>
            Vui lòng chỉ nhập 1 lựa chọn để tránh lỗi khi cộng hoặc trừ tiền
          </p>
        </div>
      </Card>
    </div>
  );
};

export default TruTienTaiKhoan;
