import { Button, Card, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useRefresh from "../../../hooks/useRefresh";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import Input from "antd/es/input/Input";
import { SearchOutlined } from "@ant-design/icons";

type Props = {};
const TableListBank = (props: Props) => {
  const dispatch = useDispatch();
  const [refresh, refecth] = useRefresh();
  const cardStyle = {
    flex: 1,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  };
  const [searchParams, setSearchParams] = useState<any>({
    page: 0,
    size: 10,
    search: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const handleChange = (value: string) => {
    setType(value);
  };

  const handleAction = (value: any) => {
    setIsModalOpen(true);
    setDataDetail(value);
  };

  const handleCancelAction = () => {
    setIsModalOpen(false);
    setDataDetail({});
  };

  const columns: any = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
      align: "center",
    },
    {
      title: "Mã ngân hàng",
      key: "code",
      dataIndex: "code",
      render: (_: any, record: any, index: number) => {
        return <span style={{ fontWeight: 700 }}> {record.code}</span>;
      },
    },
    {
      title: "Ngân hàng",
      key: "message",
      dataIndex: "message",
    },
    {
      title: "Chủ Tài khoản",
      key: "customer",
      dataIndex: "customer",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="column-account">
            <div>
              Biệt hiệu:
              <span> {record.customer.username}</span>
            </div>
            <div>
              Tên:
              <span> {record.customer.name}</span>
            </div>
          </div>
        );
      },
    },

    {
      title: "Số tài khoản",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Tác vụ",
      align: "center" as "center",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="action-btn">
            <Button
              // type="primary"
              onClick={() => handleAction(record)}
            >
              Thao tác
            </Button>
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
      type: type,
    });
    refecth();
  };

  useEffect(() => {
    const getList = async () => {
      let payload = {
        ...searchParams,
      };
      //   try {
      //     dispatch(startLoading());
      //     const response = await getAllHistoryTransaction(payload);
      //     if (response.status) {
      //       const updatedUsers: any = response.result.completedRequests.map(
      //         (item: any, i: any) => ({
      //           ...item,
      //           stt: i + 1 + searchParams.page * searchParams.size,
      //         })
      //       );
      //       setDataTable(updatedUsers);
      //       setPagination((prev) => ({
      //         ...prev,
      //         total: response.result.pagination?.total,
      //       }));
      //     }
      //   } catch (err) {
      //     setDataTable([]);
      //     dispatch(
      //       showNotification({
      //         message: "Lấy dữ liệu thất bại.",
      //         type: "error",
      //       })
      //     );
      //   } finally {
      //     dispatch(stopLoading());
      //   }
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
      <div className="card-search-selected-btn-spec">
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          onChange={handleInputChange}
        />
        <Select
          defaultValue="Chọn ngân hàng"
          onChange={handleChange}
          options={[
            { value: "", label: "Tất cả" },
            { value: "deposit", label: "Nạp tiền" },
            { value: "withdraw", label: "Trừ tiền" },
            { value: "commission", label: "Hoa hồng" },
            { value: "surplusToFreeze", label: "Chuyển tới ví đóng băng" },
            {
              value: "freezeToSurplus",
              label: "Chuyển tới ví người dùng chính",
            },
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
      <div className="table-deposit" style={{ marginTop: 15 }}>
        <Table
          columns={columns}
          dataSource={dataTable}
          scroll={{ x: 1300 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTableChange}
        />
      </div>
    </Card>
  );
};
export default TableListBank;
