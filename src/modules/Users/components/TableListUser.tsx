import {
  BankOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  CheckboxProps,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import useRefresh from "../../../hooks/useRefresh";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";
import { useDispatch } from "react-redux";
import {
  changeUserStatus,
  deleteUser,
  getDetailUser,
  getListUser,
} from "../apis";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import DateTimeComponent from "../../../utils/DateTimeComponent";
import formatCurrency from "../../../utils";
import { PiForkKnife } from "react-icons/pi";
import ModalCapDuoi from "./ModalCapDuoi";
import ModalCapTren from "./ModalCapTren";
import ModalCapNhatNganHang from "./ModalCapNhatNganHang";
import ModalUpdate from "./ModalUpdate";

const TableListUser = (props: any) => {
  const { refresh, refecth, tableType } = props;
  const dispatch = useDispatch();
  const cardStyle = {
    flex: 1,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  };
  const [searchParams, setSearchParams] = useState<any>({
    page: 0,
    size: 10,
    search: "",
    position: tableType === "agency" ? "Đại lý" : "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [modalType, setModalType] = useState<string>("");
  const [isOpenCapDuoi, setOpenCapDuoi] = useState<boolean>(false);
  const [isOpenCapTren, setOpenCapTren] = useState<boolean>(false);
  const [dataCapDuoi, setDataCapDuoi] = useState<any[]>([]);
  const [dataCapTren, setDataCapTren] = useState<any>({});
  const [isOpenBank, setOpenBank] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<any>({});
  const [isOpenDetail, setOpenDetail] = useState<boolean>(false);
  const handleChange = (value: string) => {
    setPosition(value);
  };

  const onChangeCheckbox: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const handleClose = () => {
    setModalType("");
    setOpenCapDuoi(false);
    setOpenCapTren(false);
    setDataCapDuoi([]);
    setDataCapTren({});
    setDataUser({});
    setOpenBank(false);
    setOpenDetail(false);
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteUser(id);
      if (response.status) {
        dispatch(
          showNotification({
            message: response.message,
            type: "success",
          })
        );
        refecth();
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
    }
  };
  const handleChangeStatus = async (id: string) => {
    let status = "Đã giết";
    try {
      const response = await changeUserStatus(id, { status: status });
      if (response.status) {
        dispatch(
          showNotification({
            message: response.message,
            type: "success",
          })
        );
        refecth();
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
    }
  };
  const handleOpenBank = async (id: string) => {
    setModalType("bank");
    try {
      dispatch(startLoading());
      const rp = await getDetailUser(id);
      if (rp.status) {
        setDataUser(rp.result);
        setOpenBank(true);
      } else {
        setOpenBank(false);
      }
    } catch (error) {
    } finally {
      dispatch(stopLoading());
    }
  };
  const handleOpenUpdate = async (id: string) => {
    setModalType("update");
    try {
      dispatch(startLoading());
      const rp = await getDetailUser(id);
      if (rp.status) {
        setDataUser(rp.result);
        setOpenDetail(true);
      } else {
        setOpenDetail(false);
      }
    } catch (error) {
    } finally {
      dispatch(stopLoading());
    }
  };
  const columnsInfo: any = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
      align: "center",
    },
    {
      title: "Tài khoản",
      key: "account",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="column-account">
            <div>
              ID: <span> {record.idCode}</span>
            </div>
            <div>
              Tài khoản: <span> {record.username}</span>
            </div>
            <div>
              Cấp độ VIP: <span> {record.level}</span>
            </div>
            <div>
              <Checkbox onChange={onChangeCheckbox} value={record.isMarketing}>
                Marketing
              </Checkbox>
            </div>
          </div>
        );
      },
    },
    {
      title: "Thông tin nhóm",
      key: "groupInfo",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="column-infogroup">
            <div>
              Mã giới thiệu: <span> {record.inviteCode}</span>
            </div>
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setModalType("tuyenDuoi");
                setOpenCapDuoi(true);
                setDataCapDuoi(record.userHasInvite);
              }}
            >
              Tuyến dưới
            </Button>
            <Button
              className="button-main-page"
              onClick={() => {
                setModalType("tuyenTren");
                setOpenCapTren(true);
                setDataCapTren(record.userInvite);
              }}
            >
              Xem cấp trên
            </Button>
          </div>
        );
      },
    },
    {
      title: "Số dư",
      key: "balance",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="column-account">
            <div>
              <span>Số dư: </span> {formatCurrency(record.wallet.surplus)}
            </div>
            <div>
              <span>Đóng băng: </span> {formatCurrency(record.wallet.freeze)}
            </div>
          </div>
        );
      },
    },
    {
      title: "Thống kê",
      key: "statistics",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="column-tong-tien">
            <div className="tong-nap">
              <p>*** Tổng tiền NẠP: </p>{" "}
              <span> {formatCurrency(record.wallet.deposit)}</span>
            </div>
            <div className="tong-rut">
              <p>*** Tổng tiền RÚT: </p>{" "}
              <span> {formatCurrency(record.wallet.withdraw)}</span>
            </div>
            <div className="tong-hang">
              <p>*** Tổng tiền Bonus: </p>{" "}
              <span> {formatCurrency(record.wallet.bonus)}</span>
            </div>
            <div className="tong-hang">
              <p>*** Tổng tiền hàng: </p>{" "}
              <span> {formatCurrency(record.wallet.order)}</span>
            </div>
            <div className="tong-hang">
              <p>*** Tổng tiền hoàn hàng: </p>{" "}
              <span> {formatCurrency(record.wallet.returnOrder)}</span>
            </div>
            <div className="tong-nap">
              <p>*** Tổng tiền hoa hồng: </p>{" "}
              <span> {formatCurrency(record.wallet.commission)}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: any) => <DateTimeComponent dateString={text} />,
    },
    {
      title: "",
      align: "center" as "center",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="action-btn">
            <BankOutlined
              className="btn-bank"
              onClick={() => handleOpenBank(record._id)}
            />
            {/* <LockOutlined className="btn-lock" /> */}
            <EditOutlined
              className="btn-edit"
              onClick={() => handleOpenUpdate(record._id)}
            />
            <Tooltip title="Xóa dữ liệu">
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa dữ liệu này ?"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                okText="Xác nhận"
                onConfirm={() => handleDelete(record._id)}
                cancelText="Hủy"
              >
                <DeleteOutlined className="btn-delete" />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const columnsDashboard: any = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
      align: "center",
    },
    {
      title: "Tài khoản",
      key: "account",
      render: (_: any, record: any, index: number) => {
        return <span style={{ fontWeight: 700 }}> {record.username}</span>;
      },
    },
    {
      title: "Tên",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Mã giới thiệu",
      dataIndex: "inviteCode",
      key: "inviteCode",
    },
    {
      title: "Số dư",
      key: "balance",
      render: (_: any, record: any, index: number) => {
        return <span>{formatCurrency(record.wallet.surplus)}</span>;
      },
    },
    {
      title: "Cấp trên",
      key: "userInvite",
      dataIndex: "userInvite",
      render: (text: any) => {
        return text ? (
          <span>
            {text?.name} ( {text?.username} )
          </span>
        ) : null;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => {
        let color = "green";
        if (record.status === "Tạm khóa") {
          color = "gold";
        } else if (record.status === "Đã giết") {
          color = "volcano";
        }
        return (
          <Tag color={color} key={record.status}>
            {record.status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "",
      align: "center" as "center",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="action-btn">
            <Tooltip title="Giết dữ liệu">
              <Popconfirm
                title="Bạn có chắc chắn muốn giết dữ liệu này ?"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                okText="Xác nhận"
                onConfirm={() => handleChangeStatus(record._id)}
                cancelText="Hủy"
              >
                <PiForkKnife className="btn-delete" size={25} />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const columnsAgency: any = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
      align: "center",
    },
    {
      title: "Thông tin",
      key: "account",
      render: (_: any, record: any, index: number) => {
        return (
          <span style={{ fontWeight: 700 }}>
            {record.name} ( {record.username})
          </span>
        );
      },
    },
    {
      title: "Tổng thành viên",
      key: "userHasInvite",
      dataIndex: "userHasInvite",
      render: (text: any) => text?.length,
    },
    {
      title: "Tổng hoa hồng",
      key: "commission",
      render: (_: any, record: any, index: number) => {
        return <span>{formatCurrency(record.wallet.commission)}</span>;
      },
    },
    {
      title: "Mã giới thiệu",
      key: "inviteCode",
      dataIndex: "inviteCode",
    },
    {
      title: "",
      align: "center" as "center",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="action-btn">
            <Tooltip title="Giết dữ liệu">
              <Popconfirm
                title="Bạn có chắc chắn muốn giết dữ liệu này ?"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                okText="Xác nhận"
                onConfirm={() => handleChangeStatus(record._id)}
                cancelText="Hủy"
              >
                <PiForkKnife className="btn-delete" size={25} />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const handleInputChange = (e: any) => {
    setSearch(e.target.value);
  };

  const handleSubmit = () => {
    setSearchParams({
      ...searchParams,
      page: 0,
      search: search,
      position: position,
    });
    refecth();
  };

  useEffect(() => {
    const getList = async () => {
      dispatch(startLoading());
      let payload = {
        ...searchParams,
      };
      try {
        const response = await getListUser(payload);
        if (response.status) {
          const filteredUsers = response.result.users.filter(
            (user: any) => user.role !== "Super Admin"
          );
          const updatedUsers: any = filteredUsers.map((item: any, i: any) => ({
            ...item,
            stt: i + 1 + searchParams.page * searchParams.size,
          }));
          setDataTable(updatedUsers);
          setPagination((prev) => ({
            ...prev,
            total: response.result.pagination?.total,
          }));
        }
      } catch (err) {
        setDataTable([]);
        dispatch(
          showNotification({
            message: "Lấy dữ liệu thất bại.",
            type: "error",
          })
        );
      } finally {
        dispatch(stopLoading());
      }
    };
    getList();
  }, [searchParams, refresh]);

  const handleTableChange = (pagination: any) => {
    setSearchParams({
      ...searchParams,
      page: pagination.current - 1,
      size: pagination.pageSize,
    });
    setPagination(pagination);
  };

  return (
    <Card style={{ ...cardStyle }}>
      <div className="card-search-selected-btn">
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          style={{ width: "70%" }}
          onChange={handleInputChange}
        />
        <Select
          defaultValue="Chọn trạng thái"
          onChange={handleChange}
          style={{ width: "20%" }}
          options={[
            { value: "", label: "Tất cả" },
            { value: "Tạm khóa", label: "Tạm khóa" },
            { value: "Hoạt động", label: "Hoạt động" },
            { value: "Đã giết", label: "Đã giết" },
          ]}
        />
        <Button
          className="btn-search"
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSubmit}
        >
          Tìm kiếm
        </Button>
      </div>
      <div style={{ marginTop: 15 }}>
        {tableType === "info" && (
          <Table
            columns={columnsInfo}
            dataSource={dataTable}
            scroll={{ x: 1300 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }}
            onChange={handleTableChange}
          />
        )}
        {tableType === "dashboard" && (
          <Table
            columns={columnsDashboard}
            dataSource={dataTable}
            scroll={{ x: 1300 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }}
            onChange={handleTableChange}
          />
        )}

        {tableType === "agency" && (
          <Table
            columns={columnsAgency}
            dataSource={dataTable}
            scroll={{ x: 1300 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }}
            onChange={handleTableChange}
          />
        )}
      </div>
      <ModalCapDuoi
        modalType={modalType}
        open={isOpenCapDuoi}
        dataCapDuoi={dataCapDuoi}
        handleClose={handleClose}
      />
      <ModalCapTren
        modalType={modalType}
        open={isOpenCapTren}
        dataCapTren={dataCapTren}
        handleClose={handleClose}
      />
      <ModalCapNhatNganHang
        modalType={modalType}
        open={isOpenBank}
        dataUser={dataUser}
        handleClose={handleClose}
      />
      <ModalUpdate
        modalType={modalType}
        open={isOpenDetail}
        dataUser={dataUser}
        handleClose={handleClose}
        refecth={refecth}
      />
    </Card>
  );
};

export default TableListUser;
