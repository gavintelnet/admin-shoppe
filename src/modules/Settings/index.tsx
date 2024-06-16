import { Button, Card, Form, Input, InputNumber, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";
import {
  createSetting,
  detailSetting,
  getLogoFooter,
  getLogoHeader,
  updateSetting,
} from "./apis";
import LogoHeader from "./components/LogoHeader";
import { showNotification } from "../../redux/reducers/notificationReducer";
import useRefresh from "../../hooks/useRefresh";
import LogoFooter from "./components/LogoFooter";

const Settings = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [detailLogoHeader, setDetailLogoHeader] = useState();
  const [detailLogoFooter, setDetailLogoFooter] = useState();
  const [refresh, refecth] = useRefresh();
  const cardStyle = {
    flex: 1,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(startLoading());
        const [detailLogoHeader, rpSetting, detailLogoFooter] =
          await Promise.all([
            getLogoHeader("6656784a2de1279e93bcc91a"),
            detailSetting("666e3adaf9d438d9e634555f"),
            getLogoFooter("665701da76b8c058a19a4780"),
          ]);
        if (detailLogoHeader.status) {
          setDetailLogoHeader(detailLogoHeader.result.images.url);
        }
        if (rpSetting.status) {
          form.setFieldsValue({
            nameWebsite: rpSetting.result.nameWebsite,
            baoTri: rpSetting.result.baoTri,
            minRut: rpSetting.result.minRut,
            maxRut: rpSetting.result.maxRut,
          });
          if (detailLogoFooter.status) {
            setDetailLogoFooter(detailLogoFooter.result.images.url);
          }
          // setDetailLogoHeader(detailLogoHeader.result.images.url);
        }
      } catch (err) {
      } finally {
        dispatch(stopLoading());
      }
    };
    fetchData();
  }, [refresh]);
  const onFinish = async (values: any) => {
    try {
      dispatch(startLoading());
      const rp = await updateSetting("666e3adaf9d438d9e634555f", values);
      if (rp.status) {
        dispatch(
          showNotification({
            message: rp.message,
            type: "success",
          })
        );
        refecth();
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
  };

  const formatCurrency = (amount: number | string | undefined): string => {
    if (typeof amount === "number") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    }
    return amount || "";
  };

  const parseCurrency = (value: string | undefined): number => {
    if (!value) return 0;
    return Number(value.replace(/[^\d]/g, ""));
  };
  return (
    <Card style={{ ...cardStyle }}>
      <Form
        form={form}
        layout="vertical"
        name="createUser"
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="setting-page">
          <div className="page-container setting">
            <h2 className="page-title ">Thiết lập website</h2>
            <div className="dong-ke"></div>
            <Form.Item label="Tên website" name="nameWebsite">
              <Input />
            </Form.Item>

            <Form.Item label="Bảo trì" name="baoTri">
              <Switch />
            </Form.Item>
          </div>
          <div className="page-container setting">
            <h2 className="page-title">Thiết lập rút tiền</h2>
            <div className="dong-ke"></div>
            <Form.Item label="Min rút tiền" name="minRut">
              <InputNumber
                style={{ width: "100%" }}
                // formatter={formatCurrency}
                // parser={parseCurrency}
              />
            </Form.Item>
            <Form.Item label="Max rút tiền" name="maxRut">
              <InputNumber
                style={{ width: "100%" }}
                // formatter={formatCurrency}
                // parser={parseCurrency}
              />
            </Form.Item>
          </div>
          <div className="page-container setting">
            <h2 className="page-title">Thiết lập hình ảnh</h2>
            <div className="dong-ke"></div>
            <LogoHeader detailLogoHeader={detailLogoHeader} />
            <LogoFooter detailLogoFooter={detailLogoFooter} />
          </div>
        </div>
      </Form>
      <Button
        type="primary"
        onClick={() => form.submit()}
        className="button-main-page"
        style={{ marginTop: 30 }}
      >
        Lưu
      </Button>
    </Card>
  );
};

export default Settings;
