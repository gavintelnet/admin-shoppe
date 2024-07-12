import { Children, lazy } from "react";
const Dashboard = lazy(() => import("../modules/Dashboard"));
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import {
  MdCategory,
  MdFormatSize,
  MdOutlineDashboard,
  MdOutlineHome,
} from "react-icons/md";
import { GoFileMedia } from "react-icons/go";
import { AiOutlineBank, AiOutlineDollar, AiOutlineRise } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { RiMapPinUserLine } from "react-icons/ri";

const Users = lazy(() => import("../modules/Users"));
const Products = lazy(() => import("../modules/Products"));
const Category = lazy(() => import("../modules/Category"));
const Banner = lazy(() => import("../modules/Banner"));
const Orders = lazy(() => import("../modules/Orders"));
const Deposit = lazy(() => import("../modules/Deposit"));
const Withdraw = lazy(() => import("../modules/Withdraw"));
const TruTienTaiKhoan = lazy(() => import("../modules/TruTienTaiKhoan"));
const ChuyenQuy = lazy(() => import("../modules/ChuyenQuy"));
const CauHinhNganHang = lazy(() => import("../modules/CauHinhNganHang"));
const Brand = lazy(() => import("../modules/Brand"));
const UserDashboard = lazy(() => import("../modules/Users/UserDashboard"));
const UserAgentcy = lazy(() => import("../modules/Users/UserAgentcy"));
const AdminChangeWallet = lazy(() => import("../modules/AdminChangeWallet"));
const Cskh = lazy(() => import("../modules/CSKH"));
const Settings = lazy(() => import("../modules/Settings"));

export const routes_url = [
  {
    key: "1",
    path: "/dashboard",
    label: "Bảng điều khiển",
    element: <Dashboard />,
    isPrivate: true,
    icon: <MdOutlineHome />,
  },
  {
    key: "usersManagemnet",
    label: "Tài khoản",
    children: [
      {
        key: "8",
        path: "/users/list",
        label: "Thông tin User",
        element: <Users role={null} />,
        isPrivate: true,
        icon: <UserOutlined />,
        checkDemo: true,
      },
      {
        key: "11",
        path: "/users/dashboard",
        label: "Quản lý người dùng",
        element: <UserDashboard />,
        isPrivate: true,
        icon: <BsReverseLayoutTextSidebarReverse />,
        checkDemo: true,
      },
      {
        key: "12",
        path: "/users/agency",
        label: "Đại lý (Sale)",
        element: <UserAgentcy />,
        isPrivate: true,
        icon: <RiMapPinUserLine />,
        checkDemo: true,
      },
    ],
  },
  {
    key: "productManagement",
    label: "Quản Lý Sản Phẩm",
    children: [
      {
        key: "3",
        path: "/category",
        label: "Quản lý danh mục",
        element: <Category />,
        isPrivate: true,
        icon: <MdCategory />,
      },
      {
        key: "4",
        path: "/banner",
        label: "Quản lý Banner",
        element: <Banner />,
        isPrivate: true,
        icon: <GoFileMedia />,
      },
      {
        key: "19",
        path: "/brand",
        label: "Quản lý đối tác",
        element: <Brand />,
        isPrivate: true,
        icon: <GoFileMedia />,
      },
      {
        key: "2",
        path: "/products",
        label: "Quản lý sản phẩm",
        element: <Products />,
        isPrivate: true,
        icon: <MdOutlineDashboard />,
      },
    ],
  },
  {
    key: "orderManagemnet",
    label: "Danh sách lịch sử",
    children: [
      {
        key: "6",
        path: "/order",
        label: "Lịch sử đơn hàng",
        element: <Orders />,
        isPrivate: true,
        icon: <AiOutlineRise />,
        checkDemo: true,
      },
      {
        key: "13",
        path: "/deposit-requests",
        label: "Lịch sử nạp tiền",
        element: <Deposit />,
        isPrivate: true,
        icon: <AiOutlineDollar />,
        checkDemo: true,
      },
      {
        key: "14",
        path: "/withdraw-requests",
        label: "Lịch sử rút tiền",
        element: <Withdraw />,
        isPrivate: true,
        icon: <AiOutlineDollar />,
      },
      {
        key: "7",
        path: "/admin-changes-wallet",
        label: "Admin thay đổi",
        element: <AdminChangeWallet />,
        isPrivate: true,
        icon: <AiOutlineDollar />,
        checkDemo: true,
      },
    ],
  },
  {
    key: "configManagement",
    label: "Công cụ",
    children: [
      {
        key: "9",
        path: "/cskh",
        label: "CSKH",
        element: <Cskh />,
        isPrivate: true,
        icon: <PhoneOutlined />,
        checkDemo: true,
      },
      {
        key: "5",
        path: "/settings",
        label: "Trừ tiền tài khoản",
        element: <TruTienTaiKhoan />,
        isPrivate: true,
        icon: <AiOutlineDollar />,
      },
      {
        key: "15",
        path: "/money",
        label: "Chuyển quỹ",
        element: <ChuyenQuy />,
        isPrivate: true,
        icon: <AiOutlineDollar />,
      },
      {
        key: "16",
        path: "/tool/bank",
        label: "Cấu hình ngân hàng",
        element: <CauHinhNganHang />,
        isPrivate: true,
        icon: <AiOutlineBank />,
        checkDemo: true,
      },
      {
        key: "17",
        path: "/tool/settings",
        label: "Cài đặt",
        element: <Settings />,
        isPrivate: true,
        icon: <IoSettingsOutline />,
        checkDemo: true,
      },
    ],
  },
];
