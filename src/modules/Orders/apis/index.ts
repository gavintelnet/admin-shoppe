import { API, endpoints } from "../../../api/endpoint";
import { request } from "../../../api/request";

export const getListOrders = (body: any) =>
  request<any>("post", `${API}/${endpoints.order.getList}`, body);

export const getDetailOrder = (orderId: any) =>
  request<any>("get", `${API}/${endpoints.order.getDetail}/${orderId}`);

export const changeStatusOrder = (orderId: any, payload: any) =>
  request<any>("put", `${API}/${endpoints.order.getDetail}/${orderId}`, payload);


export const totalAmountOrder = (body: any) =>
  request<any>("post", `${API}/${endpoints.order.total}`, body);


