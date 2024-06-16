import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Radio, Space } from "antd";
import { RadioChangeEvent } from "antd/lib/radio";
import useRefresh from "../../hooks/useRefresh";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";
import { getListUser, totalWalletUser } from "../Users/apis";
import { getTotal, getTotalCommission } from "../Deposit/apis";
import { getTotalRut } from "../Withdraw/apis";
import { totalAmountOrder } from "../Orders/apis";

type Props = {};

const Dashboard = (props: Props) => {
  const dispatch = useDispatch();
  const [nguoiDangKy, setTotalNguoiDangKy] = useState<any>(0);
  const [totalDaiLy, setTotalDaiLy] = useState<any>(0);
  const [tab, setTabTotal] = useState("all");
  const [tongNap, setTongNap] = useState<any>(0);
  const [tongRut, setTongRut] = useState<any>(0);
  const [tongHoaHong, setTongHoaHong] = useState<any>(0);
  const [tongBonus, setTongBonus] = useState<any>(0);
  const [tongTIenHoanHang, setTongTienHoanHang] = useState<any>(0);
  const [tongTIenHoanThanh, setTongTienHoanThanh] = useState<any>(0);
  const [tongTIenHuy, setTongTienHuy] = useState<any>(0);
  const [tongTIenDonXuLy, setTongTienDonXuLy] = useState<any>(0);
  const [tongTienKhongGiamGia, setTongTIenKhongGIamGia] = useState<any>(0);
  const [tongSoDuNguoiDungConLai, setTongSoDuNguoiDungConLai] =
    useState<any>(0);

  const [refresh, refecth] = useRefresh();

  useEffect(() => {
    const getList = async () => {
      dispatch(startLoading());

      try {
        const [
          responseNguoiDangKy,
          responseDaiLy,
          rpTotalNap,
          rpTotalRut,
          rpHoaHong,
          rpOrderHoanThanh,
          rpOrderHuy,
          rpOrderXuLy,
          rpHoanHang,
          rpSodu,
        ] = await Promise.all([
          getListUser({ page: 0, size: 10 }),
          getListUser({ page: 0, size: 10, position: "Đại lý" }),
          getTotal({ period: tab }),
          getTotalRut({ period: tab }),
          getTotalCommission({ period: tab }),
          totalAmountOrder({ status: "Hoàn thành", period: tab }),
          totalAmountOrder({ status: "Hủy", period: tab }),
          totalAmountOrder({ status: "Chờ thanh toán", period: tab }),
          totalWalletUser({ period: tab }),
          totalWalletUser({ period: tab }),
          // getAllWithdraw({ page: 0, size: 10 }),
          // getAllDeposit({ page: 0, size: 10 }),
          // getListUser({ page: 0, size: 10 }),
        ]);
        if (responseNguoiDangKy.status) {
          setTotalNguoiDangKy(responseNguoiDangKy.result.pagination?.total);
        }
        if (responseDaiLy.status) {
          setTotalDaiLy(responseDaiLy.result.pagination?.total);
        }
        if (rpTotalNap.status) {
          setTongNap(rpTotalNap.result.totalAmount);
          // setTongNap(totalNap.)
        }
        if (rpTotalRut.status) {
          setTongRut(rpTotalRut.result.totalAmount);
        }
        if (rpHoaHong.status) {
          setTongHoaHong(rpHoaHong.result.totalAmount);
        }
        if (rpOrderHoanThanh.status) {
          setTongTienHoanThanh(rpOrderHoanThanh.result.totalAmount);
        }
        if (rpOrderHuy.status) {
          setTongTienHuy(rpOrderHuy.result.totalAmount);
        }
        if (rpOrderXuLy.status) {
          setTongTienDonXuLy(rpOrderXuLy.result.totalAmount);
        }
        if (rpHoanHang.status) {
          setTongTienHoanHang(rpHoanHang.result.totalReturnOrder);
        }
        if (rpSodu.status) {
          setTongSoDuNguoiDungConLai(rpSodu.result.totalSurplus);
        }
      } catch (err) {
      } finally {
        dispatch(stopLoading());
      }
    };
    getList();
  }, [refresh, tab]);
  const onChange = (e: RadioChangeEvent) => {
    // console.log(`radio checked:${e.target.value}`);
    setTabTotal(e.target.value);
    refecth();
  };

  const cardStyle = {
    flex: 1,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    borderLeft: "10px solid #4f48aa",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 10,
        }}
      >
        <Card style={{ ...cardStyle }} bodyStyle={{ padding: "12px 24px" }}>
          <Statistic title="Người đăng ký" value={nguoiDangKy} />
        </Card>
        <Card style={{ ...cardStyle }} bodyStyle={{ padding: "12px 24px" }}>
          <Statistic title="Đã xác minh" value={nguoiDangKy} />
        </Card>
        <Card style={{ ...cardStyle }} bodyStyle={{ padding: "12px 24px" }}>
          <Statistic title="Đại lý" value={totalDaiLy} />
        </Card>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <h2 style={{ opacity: 0.8 }}>Tất cả</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <Radio.Group onChange={onChange} defaultValue="all">
                <Space wrap>
                  <Radio.Button value="all">Tất cả</Radio.Button>
                  <Radio.Button value="today">Hôm nay</Radio.Button>
                  <Radio.Button value="this_week">Tuần này</Radio.Button>
                  <Radio.Button value="last_15_days">15 Ngày</Radio.Button>
                  <Radio.Button value="this_month">Tháng này</Radio.Button>
                  <Radio.Button value="last_month">Tháng trước</Radio.Button>
                </Space>
              </Radio.Group>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Card
            title="Thống kê giao dịch"
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <Statistic title="Tổng nạp" value={tongNap} />
            <Statistic
              title="Tổng rút"
              value={tongRut}
              style={{ marginTop: 16 }}
            />
            <Statistic
              title="Tổng hoa hồng"
              value={tongHoaHong}
              style={{ marginTop: 16 }}
            />
            <Statistic
              title="Tổng Bonus"
              value={tongBonus}
              style={{ marginTop: 16 }}
            />
            <Statistic
              title="Tổng tiền hoàn hàng"
              value={tongTIenHoanHang}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Card
            title="Thống kê đơn hàng"
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <Statistic
              title="Tổng tiền đơn đang chờ thanh toán"
              value={tongTIenDonXuLy}
            />
            <Statistic
              title="Tổng tiền đơn hủy"
              value={tongTIenHuy}
              style={{ marginTop: 16 }}
            />
            <Statistic
              title="Tổng tiền đơn hoàn thành"
              value={tongTIenHoanThanh}
              style={{ marginTop: 16 }}
            />
            <Statistic
              title="Tổng tiền không giảm giá"
              value={0}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Card
            title="Số dư người dùng còn lại"
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <Statistic
              title="Tổng số dư người dùng"
              value={tongSoDuNguoiDungConLai}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
