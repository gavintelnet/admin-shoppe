import { API, endpoints } from "../../../api/endpoint";
import { request } from "../../../api/request";

export const getAllCategory = (body: any) =>
    request<any>("post", `${API}/${endpoints.category.getAll}`, body);

export const createCategory = (body: any) =>
    request<any>("post", `${API}/${endpoints.category.create}`, body);

export const deleteCategory = (id: string) =>
    request<any>("delete", `${API}/${endpoints.category.delete}/${id}`);

export const updateCategory = (id: string, body: any) =>
    request<any>("put", `${API}/${endpoints.category.update}/${id}`, body);

export const getDetailCategory = (id: string) =>
    request<any>("get", `${API}/${endpoints.category.getDetail}/${id}`);

export const getList = () =>
    request<any>("get", `${API}/${endpoints.category.getList}`);

