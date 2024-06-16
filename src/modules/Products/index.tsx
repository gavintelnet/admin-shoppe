import { Button, Form, UploadFile } from "antd";
import React, { useState } from "react";
import useRefresh from "../../hooks/useRefresh";
import { useDispatch } from "react-redux";
import TableProduct from "./Table/TableProduct";
import ModalProduct from "./Modal/ModalProduct";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";
import { showNotification } from "../../redux/reducers/notificationReducer";
import { createProduct } from "./apis";

const Products = (props: any) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm<any>();
  const [refresh, refecth] = useRefresh();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoHeader, setLogoHeader] = useState<any>(null);
  const [typeBtn, setTypeBtn] = useState("");

  const [base64List, setBase64List] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
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
    setBase64List([]);
    setFileList([]);
  };

  const onFinish = async (values: any) => {
    if (base64List.length < 1) {
      dispatch(
        showNotification({
          message: "Vui lòng chọn ảnh.",
          type: "error",
        })
      );
    } else {
      values.images = base64List;
      dispatch(startLoading());
      // console.log(values, "valuesvalues");
      await createProduct(values)
        .then((res: any) => {
          if (res.status) {
            dispatch(
              showNotification({
                message: `${res.message}`,
                type: "success",
              })
            );
            handleCancel();
            refecth();
          }
        })
        .catch((err) => {
          dispatch(
            showNotification({
              message: "Xin lòng thử lại sau!",
              type: "error",
            })
          );
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="page-title">Danh sách sản phẩm</h2>
        <div className="page-create">
          <Button className="button-header-page" onClick={showModal}>
            Thêm sản phẩm
          </Button>
        </div>
      </div>
      <TableProduct refresh={refresh} refecth={refecth} />
      <ModalProduct
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        form={form}
        onFinish={onFinish}
        typeBtn={typeBtn}
        base64List={base64List}
        setBase64List={setBase64List}
        fileList={fileList}
        setFileList={setFileList}
      />
    </div>
  );
};

export default Products;
