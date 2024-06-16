import { API, endpoints } from "../../../api/endpoint";
import { request } from "../../../api/request";

export const getAllDeposit = (body: any) =>
    request<any>("post", `${API}/${endpoints.deposit.getListDeposit}`, body);

export const getAllDepositBy = (body: any) =>
    request<any>("post", `${API}/${endpoints.deposit.getListDepositBy}`, body);

export const changeStatusDeposit = (id: string, body: any) =>
    request<any>("put", `${API}/${endpoints.deposit.changeStatusDeposit}/${id}`, body);


export const getTotal = (body: any) =>
    request<any>("post", `${API}/${endpoints.deposit.total}`, body);

export const getTotalCommission = (body: any) =>
    request<any>("post", `${API}/${endpoints.deposit.totalCommission}`, body);