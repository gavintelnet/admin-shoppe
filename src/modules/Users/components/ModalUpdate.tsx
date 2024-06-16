import { Form, Modal, Select, Button, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetPassword, updateDetailUser } from "../apis";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";

const ModalUpdate = (props: any) => {
  const { modalType, open, dataUser, handleClose, refecth } = props;
  const [form] = Form.useForm();
  const [action, setAction] = useState<string | null>(null);
  const dispatch = useDispatch();
  let title = "";
  if (modalType === "update") {
    title = "Cập nhật người dùng";
  }

  const updateInfo = async (body: any) => {
    try {
      dispatch(startLoading());
      const rp = await updateDetailUser(dataUser._id, body);
      if (rp.status) {
        dispatch(
          showNotification({
            message: rp.message,
            type: "success",
          })
        );
        handleClose();
        form.resetFields();
        setAction(null);
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
  const onResetPass = async (values: any) => {
    let payload = {
      userId: dataUser?._id,
      newPassword: values.newPassword,
    };
    try {
      dispatch(startLoading());
      const rp = await resetPassword(payload);
      if (rp.status) {
        handleClose();
        form.resetFields();
        setAction(null);
        refecth();
      }
    } catch (err) {
    } finally {
      dispatch(stopLoading());
    }
  };

  const onFinish = async (values: any) => {
    switch (action) {
      case "updateUser":
        updateInfo(values);
        break;
      case "resetPassword":
        onResetPass(values);
        break;
      case "changeStatus":
        updateInfo(values);
        break;
      case "changeLevel":
        updateInfo(values);
        break;
      case "changeRole":
        updateInfo(values);
        break;
      default:
        break;
    }
  };

  const handleActionChange = (value: string) => {
    setAction(value);
  };

  useEffect(() => {
    if (title === "Cập nhật người dùng" && dataUser) {
      form.setFieldsValue({
        name: dataUser.name,
        username: dataUser.username,
        phone: dataUser?.phone,
        email: dataUser?.email,
        role: dataUser.role,
        status: dataUser.status,
        level: dataUser.level,
        position: dataUser.position,
      });
    }
  }, [title, dataUser, form]);
  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={"30%"}
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="Hành động" name="action">
          <Select
            showSearch
            placeholder="Chọn hành động"
            style={{ width: "100%" }}
            options={[
              { value: "updateUser", label: "Cập nhật thông tin tài khoản" },
              { value: "resetPassword", label: "Reset mật khẩu" },
              { value: "changeStatus", label: "Thay đổi trạng thái tài khoản" },
              { value: "changeLevel", label: "Cập nhật cấp độ VIP" },
              { value: "changeRole", label: "Cập nhật quyền tài khoản" },
            ]}
            onChange={handleActionChange}
          />
        </Form.Item>

        {action === "updateUser" && (
          <div>
            <Form.Item
              label="Tên người dùng"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng!" },
              ]}
            >
              <Input placeholder="Nhập tên nhân viên" />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input placeholder="Số điện thoại" />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên đăng nhập!",
                },
              ]}
            >
              <Input placeholder="Nhập tên đăng nhập" disabled />
            </Form.Item>
            <Form.Item label="Quyền tài khoản" name="role">
              <Select
                showSearch
                placeholder="Chọn quyền"
                style={{ width: "100%" }}
                options={[
                  { value: "Tài khoản thường", label: "Tài khoản thường" },
                  { value: "Quản trị viên", label: "Quản trị viên" },
                ]}
              />
            </Form.Item>
          </div>
        )}
        {action === "resetPassword" && (
          <div>
            <Form.Item label="Tên đăng nhập" name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Nhập mật khẩu mới" name="newPassword">
              <Input />
            </Form.Item>
          </div>
        )}
        {action === "changeStatus" && (
          <div>
            <Form.Item label="Tên đăng nhập" name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Trạng thái" name="status">
              <Select
                defaultValue="Chọn trạng thái"
                //   style={{ width: "20%" }}
                options={[
                  { value: "Tạm khóa", label: "Tạm khóa" },
                  { value: "Hoạt động", label: "Hoạt động" },
                  { value: "Đã giết", label: "Đã giết" },
                ]}
              />
            </Form.Item>
          </div>
        )}
        {action === "changeLevel" && (
          <div>
            <div>
              <Form.Item label="Tên đăng nhập" name="username">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Cấp độ tài khoản" name="level">
                <Input />
              </Form.Item>
            </div>
          </div>
        )}
        {action === "changeRole" && (
          <div>
            <Form.Item label="Tên đăng nhập" name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Chức danh" name="position">
              <Select
                defaultValue="Chọn chức danh"
                //   style={{ width: "20%" }}
                options={[
                  { value: "Đại lý", label: "Đại lý" },
                  { value: "Người dùng", label: "Người dùng" },
                ]}
              />
            </Form.Item>
          </div>
        )}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="default"
            onClick={() => {
              handleClose();
              form.resetFields();
            }}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="button-main-page"
            style={{ marginLeft: 8 }}
          >
            Lưu
          </Button>
        </Form.Item>
      </Form>
      {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
    </Modal>
  );
};

export default ModalUpdate;
