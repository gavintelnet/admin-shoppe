import { API, endpoints } from "../../../api/endpoint";
import { request } from "../../../api/request";

export const getListUser = (body: any) =>
    request<any>("post", `${API}/${endpoints.user.list}`, body);


export const createUser = async (body: any) => {
    const response = await request('post', `${API}/${endpoints.user.create}`, body);
    return response;
};

export const deleteUser = async (id: any) => {
    const response = await request('delete', `${API}/${endpoints.user.delete}/${id}`,);
    return response;
};

export const changeUserStatus = async (id: any, status: any) => {
    const response = await request('put', `${API}/${endpoints.user.changeStatus}/${id}`, status);
    return response;
};

export const getDetailUser = (id: string) =>
    request<any>("get", `${API}/${endpoints.user.detailUsers}/${id}`);

export const createBank = (body: any) =>
    request<any>("post", `${API}/${endpoints.bank.create}`, body);


export const updateBank = (id: string, body: any) =>
    request<any>("put", `${API}/${endpoints.bank.update}/${id}`, body);


export const deleteBank = (id: any) =>
    request<any>("delete", `${API}/${endpoints.bank.delete}/${id}`,);

export const updateDetailUser = (id: string, body: any) =>
    request<any>("put", `${API}/${endpoints.user.detailUsers}/${id}`, body);

export const resetPassword = (body: any) =>
    request<any>("post", `${API}/${endpoints.user.resetPassword}`, body);

export const totalWalletUser = (body: any) =>
    request<any>("post", `${API}/${endpoints.user.totalWallet}`, body);