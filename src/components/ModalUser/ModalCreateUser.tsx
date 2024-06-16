import { Form, Input, Modal, Button, Select } from "antd";
import React from "react";

const { Option } = Select;
const ModalCreateUser = (props: any) => {
  const { open, onOk, onCancel, form, onFinish, onFinishFailed, agency } =
    props;
  return (
    <div>
      <Modal
        title="Tạo mới người dùng"
        visible={open}
        onOk={onOk}
        onCancel={onCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          name="createUser"
          // initialValues={{
          //   position: agency === "agency" ? "Đại lý" : "Người dùng",
          // }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
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
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Mã giới thiệu" name="importInviteCode">
            <Input placeholder="Nhập mã giới thiệu" />
          </Form.Item>
          {agency !== "agency" && (
            <Form.Item label="Chức danh" name="position">
              <Select>
                <Option value="Người dùng">Người dùng</Option>
                <Option value="Đại lý">Đại lý</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="default" onClick={onCancel}>
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
      </Modal>
    </div>
  );
};

export default ModalCreateUser;
