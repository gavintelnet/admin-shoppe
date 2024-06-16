import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import bg from "../../assets/images/bg-horizontal.jpg";
import logo from "../../assets/images/logo-auth.png";
import { loginUser } from "../../api/utils/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../utils";
import { showNotification } from "../../redux/reducers/notificationReducer";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";

const AuthLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setValue: setToken } = useLocalStorage("user_token", "");
  const { setValue: setIsLogin } = useLocalStorage("isLogin", "");
  const { setValue: setUserData } = useLocalStorage("userData", "");
  const onFinish = async (values: { username: string; password: string }) => {
    dispatch(startLoading());
    try {
      const response = await loginUser(values);
      if (response.status) {
        if (response.result.user.role === "Tài khoản thường") {
          dispatch(
            showNotification({
              message: "Tài khoản không có quyền truy cập!",
              type: "error",
            })
          );
        } else {
          setToken(response.result.token);
          setIsLogin(true);
          setUserData(response.result.user);
          dispatch(
            showNotification({ message: response.message, type: "success" })
          );
          navigate("/dashboard");
        }
      } else {
        setIsLogin(false);
        dispatch(
          showNotification({
            message: response.message,
            type: "error",
          })
        );
      }
    } catch (err) {
      setIsLogin(false);
      dispatch(
        showNotification({
          message: "Lỗi hệ thống",
          type: "error",
        })
      );
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${bg})` }}>
      <div className="login-form">
        <img
          style={{
            width: 140,
            margin: "0  auto",
            display: "flex",
            marginBottom: 24,
          }}
          src={logo}
          alt=""
        />
        <h2 className="title">Đăng nhập</h2>
        <Form
          name="normal_login"
          // className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Tên đăng nhập"
              style={{ height: 40 }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input
              style={{ height: 40 }}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="button">
              <span>Đăng Nhập</span>
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AuthLayout;
