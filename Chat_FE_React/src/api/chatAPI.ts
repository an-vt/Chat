import { Attendee, Message, RoomAdd, UserInfo } from "../models";
import axiosClient from "./axiosClient";

const CHAT_ENDPOINT = "/api/v1/chat";
const chatApi = {
  getListRoom(userId: string): Promise<Attendee | undefined> {
    const url = `${CHAT_ENDPOINT}/room/user/${userId}`;
    return axiosClient.get(url);
  },
  createRoom(data: RoomAdd) {
    const url = `${CHAT_ENDPOINT}/add`;
    return axiosClient.post(url, data);
  },
  getAllMemberUnAdd(): Promise<UserInfo[] | undefined> {
    const url = `${CHAT_ENDPOINT}/member/unadd`;
    return axiosClient.get(url);
  },
  getListMessage(roomId: string): Promise<Message[] | undefined> {
    const url = `${CHAT_ENDPOINT}/message/${roomId}`;
    return axiosClient.get(url);
  },
  sendMessage(data: Message) {
    const url = `${CHAT_ENDPOINT}/message`;
    return axiosClient.post(url, data);
  },
};

export default chatApi;
