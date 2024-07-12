import React, { useState } from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import logoCMS from "../../assets/images/logocms.png";
import { routes_url } from "../../routes/routes";
import Notification from "../../modules/CSKH/components/Notification";
import { useDispatch } from "react-redux";
import { showNotification } from "../../redux/reducers/notificationReducer";

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

const MainLayout = (props: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const userData = localStorage.getItem("userData");
  const user: any = userData ? JSON.parse(userData) : null;
  const dispatch = useDispatch();
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="0">
        <span>Thông tin cá nhân</span>
      </Menu.Item>
      <Menu.Item
        key="1"
        onClick={() => {
          window.localStorage.clear();
          window.location.href = "/login";
        }}
      >
        <span>Đăng xuất</span>
      </Menu.Item>
    </Menu>
  );
  const handleCheckUser = (val: boolean) => {
    if (user && user?.position === "Demo" && val) {
      dispatch(
        showNotification({
          message: "Tài khoản không có quyền truy cập.",
          type: "error",
        })
      );
      return false;
    }
    return true;
  };

  const handleMenuClick = (path: any, checkDemo: any) => {
    if (handleCheckUser(checkDemo)) {
      navigate(path);
    }
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        style={{ background: "#fff", overflowY: "auto", height: "100vh" }}
      >
        <div
          className="logo"
          style={{
            margin: 20,
          }}
        >
          <img src={logoCMS} alt="logo" style={{ width: "100%", height: 40 }} />
        </div>
        <Menu selectedKeys={[`${location.pathname}`]} mode="inline">
          {routes_url.map((group) =>
            group.children ? (
              <Menu.ItemGroup key={group.key} title={group.label}>
                {group.children.map((item: any) => (
                  <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    className={
                      location.pathname === item.path
                        ? "ant-menu-item-selected"
                        : ""
                    }
                    onClick={() => handleMenuClick(item.path, item?.checkDemo)}
                  >
                    {/* <Link to={item.path}>{item.label}</Link> */}
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
            ) : (
              <Menu.Item
                key={group.key}
                icon={group.icon}
                className={
                  location.pathname === group.path
                    ? "ant-menu-item-selected"
                    : ""
                }
              >
                <Link to={group.path}>{group.label}</Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginLeft: 20 }}
          >
            {collapsed ? (
              <MenuUnfoldOutlined
                style={{ fontSize: 25 }}
                className="trigger"
                onClick={toggle}
              />
            ) : (
              <MenuFoldOutlined
                style={{ fontSize: 25 }}
                className="trigger"
                onClick={toggle}
              />
            )}
            <div className="remix-logo-title" onClick={() => navigate("/")}>
              <h2>Quản trị website</h2>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: 40 }}>
            <div style={{ position: "relative", top: 8 }}>
              <Notification />
            </div>
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  marginRight: "16px",
                }}
              >
                <Avatar
                  style={{ backgroundColor: "#87d068" }}
                  icon={<UserOutlined />}
                />
                <span style={{ marginLeft: "8px", fontWeight: 600 }}>
                  Quản trị viên
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "20px 16px",
            minHeight: 280,
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
