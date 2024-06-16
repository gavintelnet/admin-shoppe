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
import { useDispatch } from "react-redux";

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
const ModalBrand = (props: any) => {
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
    title = "Tạo mới đối tác";
  } else if (typeBtn === "update") {
    title = "Cập nhật đối tác";
  }
  const dispatch = useDispatch();
  const [listCate, setListCate] = useState([]);
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
    if (title === "Cập nhật đối tác" && dataDetail) {
      form.setFieldsValue({
        name: dataDetail.name,
        description: dataDetail.description,
      });
    }
  }, [title, dataDetail, form]);
  return  <div>
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
        label="Tên đối tác"
        name="name"
        rules={[
          { required: true, message: "Vui lòng nhập tên đối tác!" },
        ]}
      >
        <Input placeholder="Nhập tên đối tác" />
      </Form.Item>
     
      <Form.Item label="Mô tả" name="description">
        <Input placeholder="Nhập mô tả" />
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
</div>;
};
export default ModalBrand;
