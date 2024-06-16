import { API, endpoints } from "../../../api/endpoint";
import { request } from "../../../api/request";


export const createBanner = (body: any) =>
    request<any>("post", `${API}/${endpoints.banner.create}`, body);

export const getAllBanner = (body: any) =>
    request<any>("post", `${API}/${endpoints.banner.get}`, body);

export const deleteBanner = (id: string) =>
    request<any>("delete", `${API}/${endpoints.banner.delete}/${id}`);

export const detailBanner = (id: string) =>
    request<any>("get", `${API}/${endpoints.banner.detail}/${id}`);

export const updateBanner = (id: string, body: any) =>
    request<any>("put", `${API}/${endpoints.banner.update}/${id}`, body);
