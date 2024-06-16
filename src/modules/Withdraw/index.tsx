import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useRefresh from "../../hooks/useRefresh";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";
import { showNotification } from "../../redux/reducers/notificationReducer";
import CardInfo from "./components/CardInfo";
import TableWithdraw from "./Table/TableWithdraw";
import { getAllDrawBy } from "./apis";

const Withdraw = (props: any) => {
  const dispatch = useDispatch();
  const [refresh, refecth] = useRefresh();
  const [pendingCount, setPendingCount] = useState(0);
  const [totalCompletedAmount, setTotalCompletedAmount] = useState(0);
  const [totalAmountToday, setTotalAmountToday] = useState(0);

  useEffect(() => {
    const getAllDepositTotal = async () => {
      let payload = {
        period: "today",
      };
      try {
        dispatch(startLoading());
        const response = await getAllDrawBy(payload);
        if (response.status) {
          setTotalAmountToday(response.result.totalAmount);
        }
      } catch (err) {
        dispatch(
          showNotification({
            message: "Lấy dữ liệu tổng tiền rút trong hôm nay thất bại.",
            type: "error",
          })
        );
      } finally {
        dispatch(stopLoading());
      }
    };
    getAllDepositTotal();
  }, [refresh]);
  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="page-title">Danh sách rút tiền</h2>
      </div>
      <CardInfo
        pendingCount={pendingCount}
        totalCompletedAmount={totalCompletedAmount}
        totalAmountToday={totalAmountToday}
      />
      <TableWithdraw
        refresh={refresh}
        refecth={refecth}
        setPendingCount={setPendingCount}
        setTotalCompletedAmount={setTotalCompletedAmount}
      />
    </div>
  );
};

export default Withdraw;
