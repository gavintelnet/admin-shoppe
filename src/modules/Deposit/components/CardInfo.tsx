import { Card, Statistic } from "antd";
import formatCurrency from "../../../utils";

const CardInfo = (props: any) => {
  const { pendingCount, totalCompletedAmount, totalAmountToday } = props;
  const cardStyle = {
    flex: 1,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    borderLeft: "10px solid #4f48aa",
  };
  const valueStyle = {
    fontSize: 15,
    fontWeight: 600,
    display: "block",
    marginTop: "10px",
  };
  const titleStyle = {
    display: "block",
  };
  return (
    <div className="card-info">
      <Card style={{ ...cardStyle }} bodyStyle={{ padding: "3px 6px" }}>
        <Statistic
          title={<span style={titleStyle}>Tổng tiền nạp</span>}
          valueStyle={valueStyle}
          value={formatCurrency(totalCompletedAmount)}
        />
      </Card>
      <Card style={{ ...cardStyle }} bodyStyle={{ padding: "3px 6px" }}>
        <Statistic
          title={<span style={titleStyle}>Tổng tiền nạp ngày hôm nay</span>}
          valueStyle={valueStyle}
          value={formatCurrency(totalAmountToday)}
        />
      </Card>
      <Card style={{ ...cardStyle }} bodyStyle={{ padding: "3px 6px" }}>
        <Statistic
          title={<span style={titleStyle}>Tổng số lệnh đang chờ</span>}
          valueStyle={valueStyle}
          value={pendingCount}
        />
      </Card>
    </div>
  );
};
export default CardInfo;
