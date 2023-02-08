export const StorageKeys = {
  ACCESS_TOKEN: process.env.REACT_APP_ACCESS_TOKEN || "access-token",
  REMEMBER_ME: "remember-me",
};

export type RoomType = "SELF" | "GROUP";
export type MessageType = "TEXT" | "IMAGE";
export const formatYYYYMMSlash = "YYYY/MM";
