import { Button, Form } from "antd";
import { useDispatch } from "react-redux";
import useRefresh from "../../hooks/useRefresh";
import { useState } from "react";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";
import { showNotification } from "../../redux/reducers/notificationReducer";
import { createBrand } from "./apis";
import TableBrand from "./Table/TableBrand";
import ModalBrand from "./Modal/ModalBrand";

type Props = {}
const Brand = (props: Props) => {
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
        const response = await createBrand(payload);
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
      <h2 className="page-title">Danh sách đối tác</h2>
      <div className="page-create">
        <Button className="button-header-page" onClick={showModal}>
          Thêm đối tác
        </Button>
      </div>
    </div>
    <TableBrand refresh={refresh} refecth={refecth} />
    <ModalBrand
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
  )
}
export default Brand