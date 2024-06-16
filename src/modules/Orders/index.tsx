import React from "react";
import TableOrders from "./Table/TableOrders";
const Orders = (props: any) => {
  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="page-title">Lịch sử đặt hàng</h2>
      </div>
      <TableOrders />
    </div>
  );
};

export default Orders;
