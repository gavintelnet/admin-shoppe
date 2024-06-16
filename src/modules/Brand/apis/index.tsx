import { API, endpoints } from "../../../api/endpoint";
import { request } from "../../../api/request";


export const createBrand = (body: any) =>
    request<any>("post", `${API}/${endpoints.brand.create}`, body);

export const getAllBrand = (body: any) =>
    request<any>("post", `${API}/${endpoints.brand.getAll}`, body);

export const deleteBrand = (id: string) =>
    request<any>("delete", `${API}/${endpoints.brand.delete}/${id}`);

export const detailBrand = (id: string) =>
    request<any>("get", `${API}/${endpoints.brand.detail}/${id}`);

export const updateBrand = (id: string, body: any) =>
    request<any>("put", `${API}/${endpoints.brand.update}/${id}`, body);

export const getListBrand = () =>
    request<any>("get", `${API}/${endpoints.brand.getNoPage}`);

