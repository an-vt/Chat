import { UserInfo } from "../models";
import axiosClient from "./axiosClient";

const USER_ENDPOINT = "/api/v1/users";
const userApi = {
  getAllUser(): Promise<UserInfo[] | undefined> {
    const url = `${USER_ENDPOINT}`;
    return axiosClient.get(url);
  },
  getMe(): Promise<UserInfo | undefined> {
    const url = `${USER_ENDPOINT}/me`;
    return axiosClient.get(url);
  },
  updateAvatar(id: string, data: Partial<UserInfo>) {
    const url = `${USER_ENDPOINT}/${id}/avatar`;
    return axiosClient.put(url, data);
  },
};

export default userApi;
