import { Card, Statistic } from "antd";
import React from "react";

const CardInfo = (props: any) => {
  const {totalUser, totalDeposit, totalWithdraw} = props
  const cardStyle = {
    flex: 1,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    borderLeft: "10px solid #4f48aa",
  };
  return (
    <div className="card-info">
      <Card style={{ ...cardStyle }} bodyStyle={{ padding: "3px 6px" }}>
        <Statistic title="Tổng người dùng" value={totalUser} />
      </Card>
      <Card style={{ ...cardStyle }} bodyStyle={{ padding: "3px 6px" }}>
        <Statistic title="Tổng tiền nạp" value={totalDeposit} />
      </Card>
      <Card style={{ ...cardStyle }} bodyStyle={{ padding: "3px 6px" }}>
        <Statistic title="Tổng tiền rút" value={totalWithdraw} />
      </Card>
    </div>
  );
};

export default CardInfo;
