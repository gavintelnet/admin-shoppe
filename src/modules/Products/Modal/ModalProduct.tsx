import Upload, { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getList } from "../../Category/apis";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
} from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { PlusOutlined } from "@ant-design/icons";
import { getListBrand } from "../../Brand/apis";

const { Option } = Select;
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const urlToBase64 = (url: string): Promise<string> =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

const ModalProduct = (props: any) => {
  const {
    open,
    onOk,
    onCancel,
    form,
    onFinish,
    onFinishFailed,
    typeBtn,
    dataDetail,
    base64List,
    setBase64List,
    fileList,
    setFileList,
  } = props;
  let title = "";
  if (typeBtn === "add") {
    title = "Tạo mới sản phẩm";
  } else if (typeBtn === "update") {
    title = "Cập nhật sản phẩm";
  }
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const dispatch = useDispatch();

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    const base64Strings = await Promise.all(
      newFileList.map(async (file) => {
        if (file.originFileObj) {
          return await getBase64(file.originFileObj as RcFile);
        } else if (file.url) {
          return await urlToBase64(file.url);
        } else {
          return "";
        }
      })
    );

    const validBase64Strings = base64Strings.filter((base64) => base64);
    setBase64List(validBase64Strings);
    setFileList(newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Chọn hình ảnh</div>
    </button>
  );

  const beforeUpload = (file: RcFile): boolean => {
    return false; // Prevent automatic upload
  };

  const [listCate, setListCate] = useState([]);
  const [brand, setListBrand] = useState([]);
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
    const getAllBrands = async () => {
      try {
        const res = await getListBrand();
        if (res.status) {
          const formattedCategories = res.result.map((category: any) => ({
            value: category?._id,
            label: category?.name,
          }));
          setListBrand(formattedCategories);
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
        setListBrand([]);
        dispatch(
          showNotification({
            message: "Lấy dữ liệu thất bại.",
            type: "error",
          })
        );
      }
    };
    getAllBrands();
    getListCategories();
  }, []);

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    if (title === "Cập nhật sản phẩm" && dataDetail) {
      form.setFieldsValue({
        name: dataDetail.name,
        category: dataDetail.category?._id,
        brand: dataDetail.brand?._id,
        price: dataDetail.price,
        productType: dataDetail.productType,
        description: dataDetail.description,
        isShow: dataDetail.isShow,
        count: dataDetail.count,
      });
    }
  }, [title, dataDetail, form]);

  return (
    <div>
      <Modal
        width={"75%"}
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
          //   style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                ]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá bán sản phẩm"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá bán sản phẩm!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập giá bán sản phẩm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Danh mục sản phẩm"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn danh mục sản phẩm!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn danh mục"
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={listCate}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Đối tác"
                name="brand"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn đối tác sản phẩm!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn đối tác"
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={brand}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Loại sản phẩm"
                name="productType"
                initialValue="product"
              >
                <Select>
                  <Option value="product">Sản phẩm</Option>
                  <Option value="mission">Nhiệm vụ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Nhập lượt bán" name="count">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập lượt bán"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="isShow"
                label="Hiển thị follow"
                initialValue={false}
              >
                <Switch defaultChecked={false} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="description" label="Mô tả">
                <CKEditor
                  editor={ClassicEditor}
                  onChange={(event, editor) => {
                    form.setFieldsValue({ description: editor.getData() });
                  }}
                  data={dataDetail ? dataDetail.description : ""}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chọn hình ảnh" name="images">
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
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
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
export default ModalProduct;
