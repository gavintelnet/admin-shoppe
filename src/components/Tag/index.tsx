import { Tag } from "antd";

export const Tags = (value: string) => {
  switch (value) {
    case "Hoạt động":
      return (
        <Tag color="#87d068">
          <span>Hoạt động</span>
        </Tag>
      );
    case "Tạm khóa":
      return (
        <Tag color="#f50">
          {" "}
          <span>{value}</span>
        </Tag>
      );
    case "Đang chờ xử lý":
      return (
        <Tag color="#E6B800">
          {" "}
          <span>{value}</span>
        </Tag>
      );
    case "Chờ thanh toán":
      return (
        <Tag color="#E6B800">
          {" "}
          <span>{value}</span>
        </Tag>
      );
    case "Đang kiểm duyệt":
      return (
        <Tag color="#2db7f5">
          {" "}
          <span>{value}</span>
        </Tag>
      );
    case "Hoàn thành":
      return (
        <Tag color="#87d068">
          <span>{value}</span>
        </Tag>
      );
    case "Đã huỷ":
      return (
        <Tag color="red">
          {" "}
          <span>{value}</span>
        </Tag>
      );
    case "Hủy":
      return (
        <Tag color="#f50">
          <span>{value}</span>
        </Tag>
      );
    case "Từ chối":
      return (
        <Tag color="#f50">
          {" "}
          <span>{value}</span>
        </Tag>
      );
    case "Đã hoàn thành":
      return (
        <Tag color="#87d068">
          {" "}
          <span>{value}</span>
        </Tag>
      );
  }
};
