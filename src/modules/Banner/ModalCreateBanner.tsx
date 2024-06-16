import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
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
import { getList } from "../Category/apis";
import { useDispatch } from "react-redux";
import { showNotification } from "../../redux/reducers/notificationReducer";
import { RcFile } from "antd/es/upload";

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

const ModalCreateBanner = (props: any) => {
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
    setPreviewOpen,
    setPreviewImage,
    setFileList,
    previewOpen,
    previewImage,
    fileList,
    handlePreview,
    handleChange,
  } = props;
  let title = "";
  if (typeBtn === "add") {
    title = "Tạo mới banner";
  } else if (typeBtn === "update") {
    title = "Cập nhật banner";
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

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Chọn ảnh</div>
    </button>
  );

  const beforeUpload = (file: RcFile): boolean => {
    return false; // Prevent automatic upload
  };
  useEffect(() => {
    const getListCategories = async () => {
      try {
        const res = await getList();
        if (res.status) {
          const formattedCategories = res.result.map((category: any) => ({
            value: category?._id,
            label: category?.name,
          }));
          setListCate(formattedCategories);
        } else {
          setListCate([]);
          dispatch(
            showNotification({
              message: "Lấy dữ liệu thất bại.",
              type: "error",
            })
          );
        }
      } catch (err) {
        setListCate([]);
        dispatch(
          showNotification({
            message: "Lấy dữ liệu thất bại.",
            type: "error",
          })
        );
      }
    };
    getListCategories();
  }, []);
  useEffect(() => {
    if (title === "Cập nhật banner" && dataDetail) {
      form.setFieldsValue({
        name: dataDetail.name,
        description: dataDetail.description,
        category: dataDetail.category?._id,
      });
    }
  }, [title, dataDetail, form]);
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
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
            label="Tiêu đề banner"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề banner!" },
            ]}
          >
            <Input placeholder="Nhập tiêu đề banner" />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select
              showSearch
              placeholder="Chọn danh mục"
              optionFilterProp="children"
              filterOption={filterOption}
              options={listCate}
            />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input placeholder="Nhập mô tả" />
          </Form.Item>

          <Form.Item>
            <Upload
              multiple
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={beforeUpload}
            >
              {uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
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
export default ModalCreateBanner;
