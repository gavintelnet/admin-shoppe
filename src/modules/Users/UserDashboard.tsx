import React from "react";
import TableListUser from "./components/TableListUser";
import useRefresh from "../../hooks/useRefresh";

const UserDashboard = (props: any) => {
  const [refresh, refecth] = useRefresh();
  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="page-title">Tổng quan</h2>
      </div>
      <TableListUser
        refresh={refresh}
        refecth={refecth}
        tableType="dashboard"
      />
    </div>
  );
};

export default UserDashboard;
