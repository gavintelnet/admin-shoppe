import { Checkbox, Modal, Table } from "antd";
import React from "react";
import DateTimeComponent from "../../../utils/DateTimeComponent";
import formatCurrency from "../../../utils";

const ModalCapDuoi = (props: any) => {
  const { modalType, open, dataCapDuoi, handleClose } = props;
  let title = "";
  if (modalType === "tuyenDuoi") {
    title = "Danh sách thành viên";
  }

  const columnsInfo: any = [
    {
      title: "ID",
      dataIndex: "idCode",
      key: "idCode",
      align: "center",
    },
    {
      title: "Tài khoản",
      key: "account",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="column-account">
            <div>
              Tài khoản: <span> {record.username}</span>
            </div>
            <div>
              Cấp độ VIP: <span> {record.level}</span>
            </div>
            <div></div>
          </div>
        );
      },
    },
    {
      title: "Mã giới thiệu",
      key: "groupInfo",
      render: (_: any, record: any, index: number) => {
        return (
          <div className="column-infogroup">
            <div>
              Mã giới thiệu: <span> {record.inviteCode}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: any) => <DateTimeComponent dateString={text} />,
    },
  ];
  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={"70%"}
    >
      <Table
        columns={columnsInfo}
        dataSource={dataCapDuoi}
        scroll={{ x: 1300 }}
        // pagination={{
        //   current: pagination.current,
        //   pageSize: pagination.pageSize,
        //   total: pagination.total,
        // }}
        // onChange={handleTableChange}
      />
    </Modal>
  );
};

export default ModalCapDuoi;
