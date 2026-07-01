export interface SocketUser {
  socketId: string;
  username: string;
  roomId: string;
}

export interface JoinRoomPayload {
  username: string;
  roomId: string;
}

export interface SendMessagePayload {
  roomId: string;
  username: string;
  message: string;
}
