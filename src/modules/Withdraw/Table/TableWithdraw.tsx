import { Button, Card, CheckboxProps, Input, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";
import { SearchOutlined } from "@ant-design/icons";
import { getAllWithdraw } from "../apis";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import DateTimeComponent from "../../../utils/DateTimeComponent";
import { Tags } from "../../../components/Tag";
import formatCurrency from "../../../utils";
import ModalAction from "../Modals/ModalAction";

const TableWithdraw = (props: any) => {
  const { refresh, refecth, setPendingCount, setTotalCompletedAmount } = props;
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
    status: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const handleChange = (value: string) => {
    setStatus(value);
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
        return <span style={{ fontWeight: 700 }}> {record?.code}</span>;
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
      title: "Nội dung / Lý do từ chối",
      key: "content",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="column-account">
            <div>
              <span>Nội dung: </span>
              {record?.note}
            </div>
            {record?.status === "Từ chối" && (
              <div>
                <span>Lý do từ chối: </span> {record?.message}
              </div>
            )}
          </div>
        );
      },
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
      render: (_: any, record: any, index: number) => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ display: "flex", flexDirection: "row" }}>
              Ngày tạo đơn:
              <span style={{ fontWeight: 700 }}>
                <DateTimeComponent dateString={record.createdAt} />
              </span>
            </p>

            {record.status !== "Đang chờ xử lý" && (
              <p style={{ display: "flex", flexDirection: "row" }}>
                Ngày xử lý đơn:
                <span style={{ fontWeight: 700 }}>
                  <DateTimeComponent dateString={record.updatedAt} />
                </span>
              </p>
            )}
          </div>
        );
      },
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
      status: status,
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
        const response = await getAllWithdraw(payload);
        if (response.status) {
          const updatedUsers: any = response.result.withdraw.map(
            (item: any, i: any) => ({
              ...item,
              stt: i + 1 + searchParams.page * searchParams.size,
            })
          );
          setDataTable(updatedUsers);
          setPendingCount(response.result.pendingCount);
          setTotalCompletedAmount(response.result.totalCompletedAmount);
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
            { value: "Đang chờ xử lý", label: "Đang chờ xử lý" },
            { value: "Đã hoàn thành", label: "Đã hoàn thành" },
            { value: "Từ chối", label: "Từ chối" },
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
      <ModalAction
        open={isModalOpen}
        onCancel={handleCancelAction}
        dataDetail={dataDetail}
        refecth={refecth}
      />
    </Card>
  );
};
export default TableWithdraw;
