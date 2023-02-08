export interface JoinRoomSocket {
  userId: string;
  roomId: string;
}

export interface ReadMessageSocket {
  senderId: string;
  roomId: string;
}
