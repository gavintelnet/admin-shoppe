import { API, endpoints } from "../endpoint";
import { request } from "../request";

export const getUserChat = (userId: any) =>
    request<any>("get", `${API}/${endpoints.chat.getUserChat}/${userId}`);


export const createUserChat = (body: any) =>
    request<any>("post", `${API}/${endpoints.chat.createChat}`, body);

export const getMessageUserChat = (idChat: any) =>
    request<any>("get", `${API}/${endpoints.chat.getMessageUserChat}/${idChat}`);

export const createMessageUserChat = (body: any) =>
    request<any>("post", `${API}/${endpoints.chat.createMessage}`, body);

export const readChat = (chatId: any) =>
    request<any>("put", `${API}/${endpoints.chat.readMessage}/${chatId}`);

export const detailChat = (chatId: any) =>
    request<any>("get", `${API}/${endpoints.chat.detailChat}/${chatId}`);

// export const createMessageUserChat = async (body: any) => {
//     try {
//         const response: any = request<any>("post", `${API}/${endpoints.chat.createMessage}`, body);
//         return response.result;
//     } catch (error) {
//         throw error;
//     }
// };