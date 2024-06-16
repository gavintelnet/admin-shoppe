import { API, endpoints } from "../endpoint";
import { request } from "../request";


export const loginUser = (body: any) =>
    request<any>("post", `${API}/${endpoints.auth.login}`, body);

export const getListUserAll = () =>
    request<any>("get", `${API}/${endpoints.user.all}`);
  
export const getDetailUser = (id: string) =>
    request<any>("get", `${API}/${endpoints.user.detailUsers}/${id}`);
  