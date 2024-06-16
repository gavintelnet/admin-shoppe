import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  InputNumber,
  Modal,
  Select,
  Switch,
  Upload,
} from "antd";
import Input from "antd/es/input/Input";
import React, { useEffect, useState } from "react";

const { Option } = Select;
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

const CreateCategory = (props: any) => {
  const {
    open,
    onOk,
    onCancel,
    form,
    onFinish,
    onFinishFailed,
    logoHeader,
    setLogoHeader,
    typeBtn,
    dataDetail,
  } = props;

  let title = "";
  if (typeBtn === "add") {
    title = "Tạo mới danh mục";
  } else if (typeBtn === "update") {
    title = "Cập nhật danh mục";
  }
  const handleBeforeUploadLogoHeader = async (file: File) => {
    const base64 = await getBase64(file);
    setLogoHeader(base64);
    return false;
  };
  const handleChangeLogoHeader = async (info: any) => {
    if (info.file.status === "removed") {
      setLogoHeader(null);
    }
  };

  useEffect(() => {
    if (title === "Cập nhật danh mục" && dataDetail) {
      form.setFieldsValue({
        name: dataDetail.name,
        idCode: dataDetail.idCode,
        levelAgency: dataDetail.levelAgency,
        commission: dataDetail.commission,
        description: dataDetail.description,
        isShow: dataDetail.isShow,
      });
    }
  }, [title, dataDetail, form]);
  return (
    <div>
      <Modal
        title={title}
        visible={open}
        onOk={onOk}
        onCancel={onCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          name="createUser"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            label="Mã danh mục"
            name="idCode"
            rules={[{ required: true, message: "Vui lòng nhập mã danh mục!" }]}
          >
            <Input placeholder="Nhập mã danh mục" />
          </Form.Item>

          <Form.Item label="Cấp độ danh mục" name="levelAgency">
            <Select placeholder="Chọn cấp độ danh mục">
              <Option value="1">Đại lý cấp 1</Option>
              <Option value="2">Đại lý cấp 2</Option>
              <Option value="3">Đại lý cấp 3</Option>
              <Option value="4">Đại lý cấp 4</Option>
              <Option value="5">Đại lý cấp 5</Option>
              <Option value="6">Đại lý cấp 6</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Hoa hồng danh mục" name="commission">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập hoa hồng danh mục"
            />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input placeholder="Nhập mô tả" />
          </Form.Item>

          <Form.Item label="Hiển thị" name="isShow" initialValue={false}>
            <Switch defaultChecked={false} />
          </Form.Item>
          <Form.Item>
          {logoHeader ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Image width={200} src={logoHeader} />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Image width={200} src={dataDetail?.image?.url} />
          </div>
        )}
            <Upload
              name="avatar"
              listType="picture"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={handleBeforeUploadLogoHeader}
              onChange={handleChangeLogoHeader}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
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

export default CreateCategory;
