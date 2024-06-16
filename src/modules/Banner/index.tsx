import React, { useState } from "react";
import { showNotification } from "../../redux/reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { Button, Form, UploadFile } from "antd";
import useRefresh from "../../hooks/useRefresh";
import { createBanner } from "./apis";
import TableBanner from "./TableBanner";
import ModalCreateBanner from "./ModalCreateBanner";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";
import { RcFile, UploadProps } from "antd/es/upload";

type Props = {};

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

const Banner = (props: Props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm<any>();
  const [refresh, refecth] = useRefresh();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoHeader, setLogoHeader] = useState<any>(null);
  const [typeBtn, setTypeBtn] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [base64List, setBase64List] = useState<string[]>([]);

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
  const showModal = () => {
    setTypeBtn("add");
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setTypeBtn("");
    setIsModalOpen(false);
    form.resetFields();
    setLogoHeader(null);
    setPreviewOpen(false);
    setPreviewImage("");
    setFileList([]);
    setBase64List([]);
  };

  const onFinish = async (values: any) => {
    dispatch(startLoading());
    let payload = {
      ...values,
      // image: logoHeader,
      images: base64List,
    };
    try {
      const response = await createBanner(payload);
      if (response.status) {
        dispatch(
          showNotification({
            message: response.message,
            type: "success",
          })
        );
        refecth();
        handleCancel();
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
          message: error.message,
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
        <h2 className="page-title">Danh sách danh mục</h2>
        <div className="page-create">
          <Button className="button-header-page" onClick={showModal}>
            Thêm banner
          </Button>
        </div>
      </div>
      <TableBanner refresh={refresh} refecth={refecth} />
      <ModalCreateBanner
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        form={form}
        onFinish={onFinish}
        logoHeader={logoHeader}
        setLogoHeader={setLogoHeader}
        typeBtn={typeBtn}
        setPreviewOpen={setPreviewOpen}
        setPreviewImage={setPreviewImage}
        setFileList={setFileList}
        previewOpen={previewOpen}
        previewImage={previewImage}
        fileList={fileList}
        handlePreview={handlePreview}
        handleChange={handleChange}
      />
    </div>
  );
};

export default Banner;
