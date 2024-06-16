import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useRefresh from "../../../hooks/useRefresh";
import formatCurrency from "../../../utils";
import { Tags } from "../../../components/Tag";
import DateTimeComponent from "../../../utils/DateTimeComponent";
import { Button, Card, Input, Select, Table } from "antd";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import { SearchOutlined } from "@ant-design/icons";
import { getAllHistoryTransaction } from "../apis";
import ModalAdminChange from "../modal/ModalAdminChange";

const AdminChangeWalletTable = (props: any) => {
  const {
    setTotalAmountWithdraw,
    setTotalDepositAmount,
    setTotalCommissionAmount,
  } = props;
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
      title: "Mã đơn",
      key: "code",
      dataIndex: "code",
      render: (_: any, record: any, index: number) => {
        return <span style={{ fontWeight: 700 }}> {record.code}</span>;
      },
    },
    {
      title: "Tài khoản",
      key: "customer",
      dataIndex: "customer",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="column-account">
            <div>
              Biệt hiệu:
              <span> {record?.customer?.username}</span>
            </div>
            <div>
              Tên:
              <span> {record?.customer?.name}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      align: "left",
      render: (text: any) => formatCurrency(text),
    },
    {
      title: "Nội dung",
      key: "message",
      dataIndex: "message",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text: string) => Tags(text),
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_: any, record: any, index: number) => (
        <DateTimeComponent dateString={record.createdAt} />
      ),
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
      try {
        dispatch(startLoading());
        const response = await getAllHistoryTransaction(payload);
        if (response.status) {
          const updatedUsers: any = response.result.completedRequests.map(
            (item: any, i: any) => ({
              ...item,
              stt: i + 1 + searchParams.page * searchParams.size,
            })
          );
          setDataTable(updatedUsers);
          setTotalDepositAmount(response.result.totalDepositAmount);
          setTotalAmountWithdraw(response.result.totalWithdrawAmount);
          setTotalCommissionAmount(response.result.totalCommissionAmount);
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
      <div className="card-search-selected-btn-spec">
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          onChange={handleInputChange}
        />
        <Select
          defaultValue="Chọn loại giao dịch"
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
      <ModalAdminChange
        open={isModalOpen}
        onCancel={handleCancelAction}
        dataDetail={dataDetail}
      />
    </Card>
  );
};
export default AdminChangeWalletTable;
