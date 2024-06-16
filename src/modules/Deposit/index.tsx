import { Button, Form } from "antd";
import React, { useEffect, useState } from "react";
import CardInfo from "./components/CardInfo";
import TableDeposit from "./Table/TableDeposit";
import { useDispatch } from "react-redux";
import useRefresh from "../../hooks/useRefresh";
import { startLoading, stopLoading } from "../../redux/reducers/loadingReducer";
import { showNotification } from "../../redux/reducers/notificationReducer";
import { getAllDepositBy } from "./apis";

type Props = {};

const Deposit = (props: Props) => {
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
        const response = await getAllDepositBy(payload);
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
        <h2 className="page-title">Danh sách nạp tiền</h2>
      </div>
      <CardInfo
        pendingCount={pendingCount}
        totalCompletedAmount={totalCompletedAmount}
        totalAmountToday={totalAmountToday}
      />
      <TableDeposit
        refresh={refresh}
        refecth={refecth}
        setPendingCount={setPendingCount}
        setTotalCompletedAmount={setTotalCompletedAmount}
      />
    </div>
  );
};

export default Deposit;
