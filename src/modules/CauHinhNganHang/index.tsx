import React from "react";
import TableListBank from "./Table/TableListBank";

const CauHinhNganHang = () => {
  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="page-title">Danh sách ngân hàng</h2>
      </div>
      <TableListBank />
    </div>
  );
};

export default CauHinhNganHang;
