import { API, endpoints } from "../../../api/endpoint";
import { request } from "../../../api/request";

export const getAllWithdraw = (body: any) =>
    request<any>("post", `${API}/${endpoints.withdraw.getListWithdraw}`, body);

export const getAllDrawBy = (body: any) =>
    request<any>("post", `${API}/${endpoints.withdraw.getListWithdrawBy}`, body);

export const changeStatusDraw = (id: string, body: any) =>
    request<any>("put", `${API}/${endpoints.withdraw.changeStatusDraw}/${id}`, body);


export const getTotalRut = (body: any) =>
    request<any>("post", `${API}/${endpoints.withdraw.total}`, body);