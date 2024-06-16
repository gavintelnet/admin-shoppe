import {
    Button,
    Card,
    Form,
    Image,
    Input,
    Popconfirm,
    Table,
    Tooltip,
  } from "antd";
  import { useEffect, useState } from "react";
  import { useDispatch } from "react-redux";
  import {
    EditOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
  } from "@ant-design/icons";
  import { PiForkKnife } from "react-icons/pi";
  import { RiDeleteBin5Line } from "react-icons/ri";
import { startLoading, stopLoading } from "../../../redux/reducers/loadingReducer";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import { deleteBrand, getAllBrand, updateBrand } from "../apis";
import { detailBanner } from "../../Banner/apis";
const TableBrand = (props: any) => {

    const { refresh, refecth } = props;
    const dispatch = useDispatch();
    const [form] = Form.useForm<any>();
    const cardStyle = {
      flex: 1,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    };
    const [searchParams, setSearchParams] = useState<any>({
      page: 0,
      size: 10,
      search: "",
    });
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      total: 0,
    });
    const [search, setSearch] = useState<string>("");
    const [dataTable, setDataTable] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logoHeader, setLogoHeader] = useState<any>(null);
    const [typeBtn, setTypeBtn] = useState("");
    const [dataDetail, setDataDetail] = useState({});
    const [idDataDetail, setIdDataDetail] = useState("");
    const showModal = async (id: string) => {
      setTypeBtn("update");
      dispatch(startLoading());
      try {
        const rp = await detailBanner(id);
  
        setDataDetail(rp.result);
        setIsModalOpen(true);
        setIdDataDetail(id);
      } catch (err) {
        setDataDetail({});
      } finally {
        dispatch(stopLoading());
      }
    };
  
    const handleOk = () => {
      form.submit();
    };
  
    const handleCancel = () => {
      setTypeBtn("");
      setIsModalOpen(false);
      form.resetFields();
      setLogoHeader(null);
      setDataDetail({});
      setIdDataDetail("");
    };
    const handleDelete = async (id: string) => {
      dispatch(startLoading());
      await deleteBrand(id)
        .then((res) => {
          dispatch(
            showNotification({
              message: `${res.message}`,
              type: "success",
            })
          );
          refecth();
        })
        .catch((err: any) => console.log(err))
        .finally(() => dispatch(stopLoading()));
    };
    const onFinish = async (values: any) => {
      dispatch(startLoading());
      let payload = {
        ...values,
        ...(logoHeader && { image: logoHeader }),
      };
      try {
        const response = await updateBrand(idDataDetail, payload);
        if (response.status) {
          dispatch(
            showNotification({
              message: response.message,
              type: "success",
            })
          );
          refecth();
          handleCancel();
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
            message: "Lỗi hệ thống",
            type: "error",
          })
        );
      } finally {
        dispatch(stopLoading());
      }
    };
    const columns: any = [
      {
        title: "#",
        dataIndex: "stt",
        key: "stt",
        align: "center",
      },
      {
        title: "Hình ảnh",
        dataIndex: "image",
        key: "image",
        align: "center",
        render: (image: any) => (
          <Image
            key={image.public_id}
            src={image.url}
            alt="category"
            style={{ width: 100 }}
          />
        ),
      },
      {
        title: "Tiêu đề",
        dataIndex: "name",
        key: "name",
        align: "center",
      },
  
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        align: "center",
      },
      {
        title: "Thao tác",
        align: "center" as "center",
        render: (_: any, record: any, index: number) => {
          return (
            <div className="action-btn">
              <EditOutlined
                className="btn-edit"
                onClick={() => showModal(record._id)}
              />
              <Tooltip title="Xoá dữ liệu">
                <Popconfirm
                  title="Bạn có chắc chắn muốn xoá dữ liệu này ?"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  okText="Xác nhận"
                  onConfirm={() => handleDelete(record._id)}
                  cancelText="Hủy"
                >
                  <RiDeleteBin5Line className="btn-delete" size={30} />
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
          const response = await getAllBrand(payload);
          if (response.status) {
            const updatedUsers: any = response.result.banners.map(
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
    {" "}
    <div className="card-search-selected-btn">
      <Input
        placeholder="Tìm kiếm..."
        prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
        style={{ width: "90%" }}
        onChange={handleInputChange}
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
    {/* <ModalCreateBanner
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      form={form}
      onFinish={onFinish}
      logoHeader={logoHeader}
      setLogoHeader={setLogoHeader}
      typeBtn={typeBtn}
      dataDetail={dataDetail && dataDetail}
    /> */}
  </Card>
  )
}
export default TableBrand