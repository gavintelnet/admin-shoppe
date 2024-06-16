import { Button, Col, Form, Input, Modal, Row, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { banks } from "../util";
import { createBank, deleteBank, updateBank } from "../apis";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";

const ModalCapNhatNganHang = (props: any) => {
  const { modalType, open, dataUser, handleClose } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  let title = "";
  if (modalType === "bank") {
    title = "Cập nhật thông tin ngân hàng";
  }

  const onFinish = async (values: any) => {
    if (dataUser.bank?.length > 0 && dataUser.bank) {
      try {
        dispatch(startLoading());
        let payload = { ...values, user: dataUser._id };
        const rp = await updateBank(dataUser?.bank?.[0]?._id, payload);
        if (rp.status) {
          dispatch(
            showNotification({
              message: rp.message,
              type: "success",
            })
          );
          handleClose();
          form.resetFields();
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
    } else {
      try {
        dispatch(startLoading());
        let payload = { ...values, user: dataUser._id };
        const rp = await createBank(payload);
        if (rp.status) {
          dispatch(
            showNotification({
              message: rp.message,
              type: "success",
            })
          );
          handleClose();
          form.resetFields();
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
    }
  };

  const handleDelete = async () => {
    if (dataUser.bank?.length > 0 && dataUser.bank) {
      try {
        dispatch(startLoading());
        const rp = await deleteBank(dataUser?.bank?.[0]?._id);
        if (rp.status) {
          dispatch(
            showNotification({
              message: rp.message,
              type: "success",
            })
          );
          handleClose();
          form.resetFields();
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
    }
  };
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    if (title === "Cập nhật thông tin ngân hàng" && dataUser) {
      form.setFieldsValue({
        bankName: dataUser?.bank?.[0]?.bankName,
        bankNumber: dataUser?.bank?.[0]?.bankNumber,
        bankOwner: dataUser?.bank?.[0]?.bankOwner,
      });
    }
  }, [title, dataUser, form]);
  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={"60%"}
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={10}>
            {" "}
            <Form.Item label="Tên ngân hàng" name="bankName">
              <Select
                showSearch
                placeholder="Chọn ngân hàng"
                optionFilterProp="children"
                filterOption={filterOption}
                style={{ width: "100%" }}
                options={banks}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            {" "}
            <Form.Item label="Số tài khoản" name="bankNumber">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            {" "}
            <Form.Item label="Chủ tài khoản" name="bankOwner">
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            {" "}
            <Form.Item label=" ">
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="button-main-page"
                >
                  Xác nhận
                </Button>
                <Button type="primary" danger onClick={() => handleDelete()}>
                  Xóa
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalCapNhatNganHang;
