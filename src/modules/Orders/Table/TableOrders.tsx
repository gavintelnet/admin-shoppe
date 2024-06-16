import { useDispatch } from "react-redux";
import useRefresh from "../../../hooks/useRefresh";
import { useEffect, useState } from "react";
import formatCurrency from "../../../utils";
import { Tags } from "../../../components/Tag";
import DateTimeComponent from "../../../utils/DateTimeComponent";
import { Button, Card, Select, Table } from "antd";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import { SearchOutlined } from "@ant-design/icons";
import Input from "antd/es/input/Input";
import { getDetailOrder, getListOrders } from "../apis";
import ModalStatusOrder from "../Modal/ModalStatusOrder";

const TableOrders = (props: any) => {
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
    orderStatus: "",
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

  const handleAction = async (values: any) => {
    try {
      dispatch(startLoading());
      const rp = await getDetailOrder(values._id);
      if (rp.status) {
        setIsModalOpen(true);
        setDataDetail(rp.result);
      }
    } catch (err) {
    } finally {
      dispatch(stopLoading());
    }
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
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
      align: "center",
    },
    {
      title: "Tài khoản đặt",
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
      title: "Địa chỉ giao hàng",
      key: "note",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="column-account">
            <div>
              Tên người nhận:
              <span> {record.address?.name}</span>
            </div>
            <div>
              Số điện thoại:
              <span> {record?.address?.phone}</span>
            </div>
            <div>
              Địa chỉ:
              <span> {record?.address?.location}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Số tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "left",
      render: (text: any) => formatCurrency(text),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
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

            {record.orderStatus !== "Chờ thanh toán" && (
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
      orderStatus: status,
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
        const response = await getListOrders(payload);
        if (response.status) {
          const updatedUsers: any = response.result.orders.map(
            (item: any, i: any) => ({
              ...item,
              stt: i + 1 + searchParams.page * searchParams.size,
            })
          );
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
            { value: "Chờ thanh toán", label: "Chờ thanh toán" },
            { value: "Đang kiểm duyệt", label: "Đang kiểm duyệt" },
            { value: "Hoàn thành", label: "Hoàn thành" },
            { value: "Huỷ", label: "Huỷ" },
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
      <ModalStatusOrder
        open={isModalOpen}
        onCancel={handleCancelAction}
        dataDetail={dataDetail}
        refecth={refecth}
      />
    </Card>
  );
};
export default TableOrders;
