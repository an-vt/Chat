import { AuthLogin, AuthRegister } from "../models";
import axiosClient from "./axiosClient";

const AUTH_ENDPOINT = "/oauth";
const authApi = {
  login(data: AuthLogin) {
    const url = `${AUTH_ENDPOINT}/token`;
    return axiosClient.post<AuthLogin>(url, data);
  },
  register(data: AuthRegister) {
    const url = `${AUTH_ENDPOINT}/register`;
    return axiosClient.post<AuthRegister>(url, data);
  },
};

export default authApi;
