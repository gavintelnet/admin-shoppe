import { API, endpoints } from "../../../api/endpoint";
import { request } from "../../../api/request";

export const getAllHistoryTransaction = (body: any) =>
  request<any>(
    "post",
    `${API}/${endpoints.wallet.getAllHistoryTransaction}`,
    body
  );

export const createTransaction = (body: any) =>
  request<any>("post", `${API}/${endpoints.wallet.createTransaction}`, body);
