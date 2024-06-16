import { Button, Form } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useRefresh from "../../hooks/useRefresh";
import CreateCategory from "./Modal/CreateCategory";
import { createCategory } from "./apis";
import { showNotification } from "../../redux/reducers/notificationReducer";
import TableCategories from "./Table/TableCategories";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";

const Category = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm<any>();
  const [refresh, refecth] = useRefresh();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoHeader, setLogoHeader] = useState<any>(null);
  const [typeBtn, setTypeBtn] = useState("");
  const showModal = () => {
    setTypeBtn("add")
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
  };

  const onFinish = async (values: any) => {
    dispatch(startLoading())
    let payload = {
      ...values,
      image: logoHeader,
    };
    try {
      const response = await createCategory(payload);
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
    }finally{
      dispatch(stopLoading())
    }
  };
  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="page-title">Danh sách danh mục</h2>
        <div className="page-create">
          <Button className="button-header-page" onClick={showModal}>
            Thêm danh mục
          </Button>
        </div>
      </div>
      <TableCategories refresh={refresh} refecth={refecth} />
      <CreateCategory
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        form={form}
        onFinish={onFinish}
        logoHeader={logoHeader}
        setLogoHeader={setLogoHeader}
        typeBtn={typeBtn}
      />
    </div>
  );
};

export default Category;
