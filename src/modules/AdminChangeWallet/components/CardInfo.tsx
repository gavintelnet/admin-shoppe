import { Card, Statistic } from "antd";
import formatCurrency from "../../../utils";

const CardInfo = (props: any) => {
  const { totalAmountWithdraw, totalDepositAmount, totalCommissionAmount } =
    props;
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
          title={<span style={titleStyle}>Admin nạp tiền</span>}
          valueStyle={valueStyle}
          value={formatCurrency(totalDepositAmount)}
        />
      </Card>
      <Card style={{ ...cardStyle }} bodyStyle={{ padding: "3px 6px" }}>
        <Statistic
          title={<span style={titleStyle}>Admin tiền trừ</span>}
          valueStyle={valueStyle}
          value={formatCurrency(totalAmountWithdraw)}
        />
      </Card>
      <Card style={{ ...cardStyle }} bodyStyle={{ padding: "3px 6px" }}>
        <Statistic
          title={<span style={titleStyle}>Admin nạp tiền hoa hồng</span>}
          valueStyle={valueStyle}
          value={formatCurrency(totalCommissionAmount)}
        />
      </Card>
    </div>
  );
};
export default CardInfo;
