import {
  Button,
  Card,
  Form,
  Image,
  Input,
  Popconfirm,
  Table,
  Tooltip,
  UploadFile,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";
import {
  EditOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { RiDeleteBin5Line } from "react-icons/ri";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import { deleteProduct, getListProducts, getProductDetail, updateProduct } from "../apis";
import formatCurrency from "../../../utils";
import DateTimeComponent from "../../../utils/DateTimeComponent";
import ModalProduct from "../Modal/ModalProduct";

const urlToBase64 = (url: string): Promise<string> =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

const TableProduct = (props: any) => {
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
    name: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState<string>("");
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [base64List, setBase64List] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [typeBtn, setTypeBtn] = useState("");
  const [dataDetail, setDataDetail] = useState({});
  const [idDataDetail, setIdDataDetail] = useState("");

  const showModal = async (id: string) => {
    setTypeBtn("update");
    try {
      dispatch(startLoading());
      const rp = await getProductDetail(id);
      if (rp.status) {
        setDataDetail(rp.result);

        if (rp.result && rp.result.images) {
            const imageUrls = rp.result.images.map((image: any) => ({
              uid: image._id,
              name: image.public_id,
              status: "done",
              url: image.url,
            }));
            setFileList(imageUrls);
    
            const base64Strings = await Promise.all(
              rp.result.images.map(async (image: any) => {
                return await urlToBase64(image.url);
              })
            );
            setBase64List(base64Strings);
          }
        setIsModalOpen(true);
        setIdDataDetail(id);
      } else {
        setIsModalOpen(false);
        setTypeBtn("");
        setIdDataDetail("");
        dispatch(
          showNotification({
            message: `${rp.message}`,
            type: "error",
          })
        );
      }
    } catch (err) {
      setIsModalOpen(false);
      setTypeBtn("");
      dispatch(
        showNotification({
          message: "Vui lòng thử lại.",
          type: "error",
        })
      );
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
    setBase64List([]);
    setFileList([]);
    setDataDetail({});
    setIdDataDetail("");
  };
  const handleDelete = async (id: string) => {
    dispatch(startLoading());
    await deleteProduct(id)
      .then((res) => {
        if (res.status) {
          dispatch(
            showNotification({
              message: `${res.message}`,
              type: "success",
            })
          );
          refecth();
        }
      })
      .catch((err: any) => {
        dispatch(
          showNotification({
            message: `Có lỗi xảy ra`,
            type: "error",
          })
        );
      })
      .finally(() => {
        dispatch(stopLoading());
      });
  };
  const onFinish = async (values: any) => {
    let payload = {
      ...values,
      ...(base64List && { images: base64List }),
    };
    dispatch(startLoading());
    await updateProduct(idDataDetail, payload)
      .then((res: any) => {
        if (res.status) {
          dispatch(
            showNotification({
              message: `${res.message}`,
              type: "success",
            })
          );
          handleCancel();
          refecth();
        }
      })
      .catch((err) => {
        dispatch(
          showNotification({
            message: "Xin lòng thử lại sau!",
            type: "error",
          })
        );
      })
      .finally(() => {
        dispatch(stopLoading());
        setIdDataDetail("");
      });
  };
  const columns: any = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
      align: "center",
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code",
      align: "center",
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      align: "center",
      render: (images: any) => (
        <Image
          key={images[0].public_id}
          src={images[0].url}
          alt="category"
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (_: any, record: any, index: number) => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p>{record.name}</p>
            <span style={{ fontWeight: 600 }}>
              ( Lượt bán: {record.count} )
            </span>
          </div>
        );
      },
    },

    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      align: "center",
      render: (category: any) => category.name,
    },
    {
      title: "Đối tác",
      dataIndex: "brand",
      key: "brand",
      align: "center",
      render: (brand: any) => brand.name,
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
      align: "left",
      render: (_: any, record: any, index: number) => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p>
              <span style={{ fontWeight: 600 }}>Giá bán:</span>{" "}
              {formatCurrency(record.price)}
            </p>
            <p>
              <span style={{ fontWeight: 600 }}>Lợi nhuận:</span>{" "}
              {record.commission} %
            </p>
          </div>
        );
      },
      //   render: (price: any) => ,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (price: any) => <DateTimeComponent dateString={price} />,
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
      name: search,
    });
    refecth();
  };
  useEffect(() => {
    const getList = async () => {
      let payload = {
        ...searchParams,
      };
      dispatch(startLoading());
      try {
        const response = await getListProducts(payload);
        if (response.status) {
          const updatedUsers: any = response.result.products.map(
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
      <ModalProduct
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        form={form}
        onFinish={onFinish}
        typeBtn={typeBtn}
        base64List={base64List}
        setBase64List={setBase64List}
        fileList={fileList}
        setFileList={setFileList}
        dataDetail={dataDetail}
      />
    </Card>
  );
};
export default TableProduct;
