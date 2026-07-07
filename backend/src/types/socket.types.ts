export interface SocketUser {
  socketId: string;
  userId: string;
  displayName: string;
  photoURL: string;
  roomId: string;
}

export interface JoinRoomPayload {
  roomId: string;
}

export interface SendMessagePayload {
  roomId: string;
  message: string;
}

export interface OnlineUser {
  userId: string;
  displayName: string;
  photoURL: string;
}

export interface SocketMessage {
  _id: string;
  roomId: string;
  userId: string;
  displayName: string;
  photoURL: string;
  message: string;
  createdAt: Date;
}

