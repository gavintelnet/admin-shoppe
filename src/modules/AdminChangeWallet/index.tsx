import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useRefresh from "../../hooks/useRefresh";
import CardInfo from "./components/CardInfo";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";
import { showNotification } from "../../redux/reducers/notificationReducer";
import AdminChangeWalletTable from "./Table/AdminChangeWalletTable";

const AdminChangeWallet = (props: any) => {
  const [totalDepositAmount, setTotalDepositAmount] = useState(0);
  const [totalAmountWithdraw, setTotalAmountWithdraw] = useState(0);
  const [totalCommissionAmount, setTotalCommissionAmount] = useState(0);

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="page-title">Lịch sử hệ thống</h2>
      </div>
      <CardInfo
        totalDepositAmount={totalDepositAmount}
        totalAmountWithdraw={totalAmountWithdraw}
        totalCommissionAmount={totalCommissionAmount}
      />
      <AdminChangeWalletTable
        setTotalAmountWithdraw={setTotalAmountWithdraw}
        setTotalDepositAmount={setTotalDepositAmount}
        setTotalCommissionAmount={setTotalCommissionAmount}
      />
    </div>
  );
};

export default AdminChangeWallet;
