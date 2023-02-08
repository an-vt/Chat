import axios from "axios";
import { AuthLogin } from "../models";

const AVATAR_ENDPOINT = "https://api.multiavatar.com/4645646";
const avatarApi = {
  getImage(number: number) {
    const url = `${AVATAR_ENDPOINT}/${number}`;
    return axios.get<AuthLogin>(url);
  },
};

export default avatarApi;
